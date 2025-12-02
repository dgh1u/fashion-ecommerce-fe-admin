<template>
  <div class="p-4 pt-12">
    <OrderDetail
      v-if="selectedOrderId"
      v-model:open="showOrderDetailPopup"
      :orderId="selectedOrderId"
      @order-cancelled="handleOrderCancelled"
    />

    <div class="flex items-center justify-between mb-4">
      <!-- Khu vực tìm kiếm và lọc -->
      <div class="flex gap-4">
        <a-input
          v-model:value="searchText"
          placeholder="Tìm theo mã đơn hàng..."
          style="width: 300px"
          allowClear
          class="custom-search"
          @input="handleSearch"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>

        <!-- Bộ lọc trạng thái đơn hàng -->
        <a-select
          v-model:value="selectedStatus"
          placeholder="Trạng thái"
          style="width: 150px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option value="pending">Chờ thanh toán</a-select-option>
          <a-select-option value="paid">Đã thanh toán</a-select-option>
          <a-select-option value="cancelled">Đã hủy</a-select-option>
        </a-select>

        <!-- Bộ lọc theo UserId -->
        <a-input
          v-model:value="selectedUserId"
          placeholder="User ID..."
          style="width: 100px"
          @input="handleFilterChange"
        >
          <template #prefix>
            <UserOutlined class="text-gray-200" />
          </template>
        </a-input>

        <!-- Lọc theo ngày tạo -->
        <a-date-picker
          v-model:value="startDate"
          placeholder="Từ ngày"
          style="width: 120px"
          @change="handleDateRangeChange"
          format="DD/MM/YYYY"
        />
        <a-date-picker
          v-model:value="endDate"
          placeholder="Đến ngày"
          style="width: 120px"
          @change="handleDateRangeChange"
          format="DD/MM/YYYY"
        />
      </div>
    </div>

    <!-- Bảng danh sách đơn hàng -->
    <a-table
      :columns="columns"
      :data-source="orders"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- STT -->
        <template v-if="column.key === 'stt'">
          {{ index + 1 + pagination.pageSize * (pagination.current - 1) }}
        </template>

        <!-- Mã đơn hàng -->
        <template v-if="column.key === 'orderCode'">
          <span class="font-mono text-blue-600 font-semibold">
            #{{ record.orderCode }}
          </span>
        </template>

        <!-- Thông tin khách hàng -->
        <template v-if="column.key === 'customer'">
          <div class="space-y-1">
            <div class="font-medium">{{ record.customerName }}</div>
            <div class="text-sm text-gray-500">{{ record.customerPhone }}</div>
            <div class="text-xs text-gray-400 max-w-xs truncate" :title="record.shippingAddress">
              {{ record.shippingAddress }}
            </div>
          </div>
        </template>

        <!-- Thông tin người đặt -->
        <template v-if="column.key === 'user'">
          <div class="space-y-1">
            <div class="font-medium">{{ record.userFullName || 'N/A' }}</div>
            <div class="text-sm text-gray-500">{{ record.userEmail || 'N/A' }}</div>
            <div class="text-xs text-blue-500">ID: {{ record.userId }}</div>
          </div>
        </template>

        <!-- Tổng tiền -->
        <template v-if="column.key === 'totalAmount'">
          <span class="font-semibold text-green-600">
            {{ formatCurrency(record.totalAmount) }}
          </span>
        </template>

        <!-- Trạng thái -->
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>

        <!-- Ngày tạo -->
        <template v-if="column.key === 'createdAt'">
          <div class="space-y-1">
            <div class="text-sm">
              {{ formatDateTime(record.createdAt) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ getTimeAgo(record.createdAt) }}
            </div>
          </div>
        </template>

        <!-- Ghi chú -->
        <template v-if="column.key === 'notes'">
          <div class="max-w-xs">
            <span v-if="record.notes" class="text-sm text-gray-600" :title="record.notes">
              {{ record.notes.length > 50 ? record.notes.substring(0, 50) + '...' : record.notes }}
            </span>
            <span v-else class="text-gray-400 italic">Không có ghi chú</span>
          </div>
        </template>

        <!-- Hành động -->
        <template v-if="column.key === 'action'">
          <div class="flex gap-1">
            <a-tooltip title="Xem chi tiết">
              <a-button type="link" size="small" @click="viewOrder(record)">
                <template #icon><EyeOutlined /></template>
              </a-button>
            </a-tooltip>

            <a-tooltip title="Hủy đơn hàng" v-if="canCancelOrder(record)">
              <a-button type="link" size="small" danger @click="confirmCancelOrder(record)">
                <template #icon><StopOutlined /></template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getAllOrders, cancelOrder } from "@/apis/orderService";
import { message, Modal } from "ant-design-vue";
import {
  SearchOutlined,
  EyeOutlined,
  UserOutlined,
  StopOutlined,
} from "@ant-design/icons-vue";
import OrderDetail from "./OrderDetail.vue";

export default {
  components: {
    SearchOutlined,
    EyeOutlined,
    UserOutlined,
    StopOutlined,
    OrderDetail,
  },
  setup() {
    const router = useRouter();
    const orders = ref([]);
    const loading = ref(false);
    const searchText = ref("");
    const selectedStatus = ref(null);
    const selectedUserId = ref("");
    const startDate = ref(null);
    const endDate = ref(null);
    const pagination = ref({
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
    });
    const showOrderDetailPopup = ref(false);
    const selectedOrderId = ref(null);

    // Cấu hình các cột cho bảng
    const columns = [
      { title: "STT", key: "stt", width: 60, fixed: 'left' },
      { title: "Mã đơn hàng", key: "orderCode", width: 120 },
      { title: "Thông tin khách hàng", key: "customer", width: 200 },
      { title: "Người đặt", key: "user", width: 180 },
      { title: "Tổng tiền", key: "totalAmount", width: 120 },
      { title: "Trạng thái", key: "status", width: 120 },
      { title: "Ngày tạo", key: "createdAt", width: 150 },
      { title: "Ghi chú", key: "notes", width: 150 },
      { title: "Hành động", key: "action", width: 100, fixed: 'right' },
    ];

    // Fetch danh sách đơn hàng từ API
    const fetchOrders = async () => {
      loading.value = true;
      try {
        const params = {
          start: Math.max(pagination.value.current - 1, 0),
          limit: pagination.value.pageSize,
        };

        // Thêm tìm kiếm
        if (searchText.value.trim()) {
          params.keywords = searchText.value.trim();
        }

        // Lọc theo trạng thái
        if (selectedStatus.value) {
          params.status = selectedStatus.value;
        }

        // Lọc theo UserId
        if (selectedUserId.value) {
          params.userId = selectedUserId.value;
        }

        // Lọc theo ngày
        if (startDate.value) {
          params.startDate = startDate.value.format('YYYY-MM-DD');
        }
        if (endDate.value) {
          params.endDate = endDate.value.format('YYYY-MM-DD');
        }

        const res = await getAllOrders(params);

        if (res.data && res.data.items) {
          orders.value = res.data.items;
          pagination.value.total = res.data.total || 0;
        } else {
          console.error("Dữ liệu không đúng định dạng:", res.data);
          orders.value = [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu!");
        orders.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Xử lý tìm kiếm
    const handleSearch = () => {
      pagination.value.current = 1;
      fetchOrders();
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = () => {
      pagination.value.current = 1;
      fetchOrders();
    };

    // Xử lý thay đổi khoảng thời gian
    const handleDateRangeChange = () => {
      pagination.value.current = 1;
      fetchOrders();
    };

    // Xử lý thay đổi bảng (phân trang, sắp xếp)
    const handleTableChange = (pag, filters, sorter) => {
      pagination.value = pag;
      fetchOrders();
    };

    // Xem chi tiết đơn hàng
    const viewOrder = (order) => {
      selectedOrderId.value = order.id;
      showOrderDetailPopup.value = true;
    };

    // Kiểm tra xem đơn hàng có thể hủy hay không
    const canCancelOrder = (order) => {
      // Nếu đơn hàng đang Chờ thanh toán thì cho phép hủy
      if (order.status === 'pending') {
        return true;
      }
      
      // Nếu đơn hàng đã thanh toán, kiểm tra thời gian (trong vòng 24h)
      if (order.status === 'paid') {
        const now = new Date();
        const orderDate = new Date(order.createdAt);
        const diffInHours = (now - orderDate) / (1000 * 60 * 60);
        
        // Cho phép hủy nếu chưa quá 24h
        return diffInHours <= 24;
      }
      
      // Các trạng thái khác không cho phép hủy
      return false;
    };

    // Cập nhật modal xác nhận hủy với thông tin chi tiết hơn
    const confirmCancelOrder = (order) => {
      let content = `Bạn có chắc chắn muốn hủy đơn hàng #${order.orderCode}?`;
      
      // Thêm thông báo đặc biệt cho đơn hàng đã thanh toán
      if (order.status === 'paid') {
        const orderDate = new Date(order.createdAt);
        const diffInHours = Math.floor((new Date() - orderDate) / (1000 * 60 * 60));
        content += `\n\nLưu ý: Đơn hàng này đã được thanh toán ${diffInHours} giờ trước. Việc hủy đơn sẽ cần xử lý hoàn tiền.`;
      }
      
      Modal.confirm({
        title: "Xác nhận hủy đơn hàng",
        content: content,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => handleCancelOrder(order.id),
      });
    };

    // Hủy đơn hàng
    const handleCancelOrder = async (orderId) => {
      try {
        await cancelOrder(orderId);
        message.success("Hủy đơn hàng thành công!");
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        message.error("Có lỗi xảy ra khi hủy đơn hàng!");
      }
    };

    // Xử lý khi đơn hàng được hủy từ modal detail
    const handleOrderCancelled = () => {
      fetchOrders();
    };

    // Format tiền tệ
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    // Format ngày giờ
    const formatDateTime = (dateTime) => {
      if (!dateTime) return 'N/A';
      const date = new Date(dateTime);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Tính thời gian tương đối
    const getTimeAgo = (dateTime) => {
      if (!dateTime) return '';
      const now = new Date();
      const date = new Date(dateTime);
      const diffInMilliseconds = now - date;
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
      } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
      } else {
        return `${diffInDays} ngày trước`;
      }
    };

    // Lấy màu trạng thái
    const getStatusColor = (status) => {
      const statusColors = {
        pending: 'orange',
       
        
        paid: 'green',
        cancelled: 'red',
      };
      return statusColors[status] || 'default';
    };

    // Lấy text trạng thái
    const getStatusText = (status) => {
      const statusTexts = {
        pending: 'Chờ thanh toán',
       
        paid: 'Đã thanh toán',
        
        cancelled: 'Đã hủy',
      };
      return statusTexts[status] || status;
    };

    // Theo dõi thay đổi tìm kiếm để debounce
    let searchTimeout;
    watch(searchText, () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        handleSearch();
      }, 500);
    });

    onMounted(() => {
      fetchOrders();
    });

    return {
      orders,
      loading,
      searchText,
      selectedStatus,
      selectedUserId,
      startDate,
      endDate,
      pagination,
      columns,
      showOrderDetailPopup,
      selectedOrderId,
      handleSearch,
      handleFilterChange,
      handleDateRangeChange,
      handleTableChange,
      viewOrder,
      confirmCancelOrder,
      formatCurrency,
      formatDateTime,
      getTimeAgo,
      getStatusColor,
      getStatusText,
      handleOrderCancelled,
      canCancelOrder,
    };
  },
};
</script>

<style scoped>
.custom-search :deep(.ant-input) {
  border-radius: 6px;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-tag) {
  border-radius: 4px;
  font-size: 12px;
}
</style>