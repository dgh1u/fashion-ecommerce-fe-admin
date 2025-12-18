<template>
  <a-modal
    :open="open"
    @update:open="updateOpen"
    title="Chi tiết đơn hàng"
    :footer="null"
    width="900px"
    :destroy-on-close="true"
  >
    <div v-if="loading" class="flex justify-center py-8">
      <a-spin size="large" />
    </div>

    <div v-else-if="order" class="space-y-6">
      <!-- Thông tin cơ bản đơn hàng -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <ShoppingCartOutlined class="text-blue-500" />
          Thông tin đơn hàng
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Mã đơn hàng</p>
            <p class="font-mono text-lg font-semibold text-blue-600">#{{ order.orderCode }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Trạng thái</p>
            <a-tag :color="getStatusColor(order.status)" class="text-sm">
              {{ getStatusText(order.status) }}
            </a-tag>
          </div>
          <div>
            <p class="text-sm text-gray-500">Ngày đặt hàng</p>
            <p class="font-medium">{{ formatDateTime(order.createdAt) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tổng tiền</p>
            <p class="font-semibold text-lg text-green-600">{{ formatCurrency(order.totalAmount) }}</p>
          </div>
        </div>
      </div>

      <!-- Thông tin người dùng -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <UserOutlined class="text-green-500" />
          Thông tin người dùng
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Tên người dùng</p>
            <p class="font-medium">{{ order.customerName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Số điện thoại</p>
            <p class="font-medium">{{ order.customerPhone }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-sm text-gray-500">Địa chỉ giao hàng</p>
            <p class="font-medium">{{ order.shippingAddress }}</p>
          </div>
        </div>
      </div>

      <!-- Thông tin người đặt -->
      <div class="bg-gray-50 p-4 rounded-lg" v-if="order.userFullName">
        <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <TeamOutlined class="text-purple-500" />
          Thông tin người đặt
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Tên người đặt</p>
            <p class="font-medium">{{ order.userFullName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-medium">{{ order.userEmail }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">User ID</p>
            <p class="font-medium text-blue-500">#{{ order.userId }}</p>
          </div>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <Package class="text-orange-500 w-5 h-5" />
          Danh sách sản phẩm
        </h3>
        <div class="space-y-3">
          <div
            v-for="item in order.orderItems"
            :key="item.id"
            class="bg-white p-4 rounded-lg border"
          >
            <div class="flex items-start gap-4">
              <!-- Hình ảnh sản phẩm -->
              <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  :src="getImageUrl(item.productImage)" 
                  :alt="item.productTitle"
                  @error="handleImageError"
                  v-if="item.productImage"
                  class="w-full h-full object-cover"
                />
                <Package v-else class="text-2xl text-gray-400" />
              </div>

              <!-- Thông tin sản phẩm -->
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 mb-1 truncate" :title="item.productTitle">
                  {{ item.productTitle }}
                </h4>
                
                <div class="flex items-center gap-4 text-sm">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">Size:</span>
                    <a-tag size="small" color="blue">{{ item.sizeName }}</a-tag>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">SL:</span>
                    <span class="font-medium">{{ item.quantity }}</span>
                  </div>
                </div>
              </div>

              <!-- Giá tiền -->
              <div class="text-right">
               
                <p class="text-sm text-gray-500 mt-1">Thành tiền</p>
                <p class="font-semibold text-green-600">{{ formatCurrency(item.totalPrice) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tổng kết -->
        <div class="border-t mt-4 pt-4">
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium">Tổng cộng:</span>
            <span class="text-xl font-bold text-green-600">
              {{ formatCurrency(order.totalAmount) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Ghi chú -->
      <div v-if="order.notes" class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileTextOutlined class="text-gray-500" />
          Ghi chú
        </h3>
        <p class="text-gray-700">{{ order.notes }}</p>
      </div>

      <!-- Hành động -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <a-button @click="updateOpen(false)">Đóng</a-button>
        <a-button 
          v-if="order.status === 'pending' || order.status === 'confirmed'"
          type="primary" 
          danger 
          @click="confirmCancelOrder"
        >
          <template #icon><StopOutlined /></template>
          Hủy đơn hàng
        </a-button>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-500">Không tìm thấy thông tin đơn hàng</p>
    </div>
  </a-modal>
</template>

<script>
import { ref, watch, defineEmits } from "vue";
import { getOrderById, cancelOrder } from "@/apis/orderService";
import { message, Modal } from "ant-design-vue";
import {
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  StopOutlined,
} from "@ant-design/icons-vue";
import { Package } from "lucide-vue-next";
import { useProductImages } from "@/composables/useProductImages";

export default {
  components: {
    ShoppingCartOutlined,
    UserOutlined,
    TeamOutlined,
    Package,
    FileTextOutlined,
    StopOutlined,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: [Number, String],
      default: null,
    },
  },
  emits: ['update:open', 'order-cancelled'],
  setup(props, { emit }) {
    const order = ref(null);
    const loading = ref(false);
    const { getProductImage, getImageUrl, handleImageError } = useProductImages();

    const updateOpen = (value) => {
      emit('update:open', value);
    };

    const fetchOrderDetail = async () => {
      if (!props.orderId) return;
      
      loading.value = true;
      try {
        const res = await getOrderById(props.orderId);
        if (res.data) {
          order.value = res.data;
          // Lấy hình ảnh cho các sản phẩm
          await loadOrderItemImages();
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        message.error("Có lỗi xảy ra khi tải chi tiết đơn hàng!");
      } finally {
        loading.value = false;
      }
    };

    // Load images for order items
    const loadOrderItemImages = async () => {
      if (!order.value?.orderItems) return;
      
      for (const item of order.value.orderItems) {
        if (item.productId && !item.productImage) {
          try {
            const imageUrl = await getProductImage(item.productId);
            if (imageUrl) {
              // Update the item with image
              item.productImage = imageUrl;
            }
          } catch (error) {
            console.error(`Failed to load image for product ${item.productId}:`, error);
          }
        }
      }
    };

    const confirmCancelOrder = () => {
      Modal.confirm({
        title: "Xác nhận hủy đơn hàng",
        content: `Bạn có chắc chắn muốn hủy đơn hàng #${order.value.orderCode}?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: handleCancelOrder,
      });
    };

    const handleCancelOrder = async () => {
      try {
        await cancelOrder(order.value.id);
        message.success("Hủy đơn hàng thành công!");
        emit('order-cancelled');
        updateOpen(false);
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        message.error("Có lỗi xảy ra khi hủy đơn hàng!");
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

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

    const getStatusColor = (status) => {
      const statusColors = {
        pending: 'orange',
        paid: 'green',
       
        cancelled: 'red',
      };
      return statusColors[status] || 'default';
    };

    const getStatusText = (status) => {
      const statusTexts = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
  
        cancelled: 'Đã hủy',
      };
      return statusTexts[status] || status;
    };

    // Watch cho việc mở modal và orderId
    watch([() => props.open, () => props.orderId], ([newOpen, newOrderId]) => {
      if (newOpen && newOrderId) {
        fetchOrderDetail();
      } else if (!newOpen) {
        order.value = null;
      }
    });

    return {
      order,
      loading,
      updateOpen,
      getImageUrl,
      handleImageError,
      confirmCancelOrder,
      formatCurrency,
      formatDateTime,
      getStatusColor,
      getStatusText,
    };
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>