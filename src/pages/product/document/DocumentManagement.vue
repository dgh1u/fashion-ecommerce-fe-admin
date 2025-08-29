<template>
  <div class="p-4 pt-12">
    <DocumentDetail
      v-if="selectedProductId"
      v-model:open="showDocumentDetailPopup"
      :productId="selectedProductId"
    />

    <div class="flex items-center justify-between mb-4">
      <!-- Khu vực tìm kiếm và lọc -->
      <div class="flex gap-4">
        <a-input
          v-model:value="searchText"
          placeholder="Nhập Tiêu đề bài viết..."
          style="width: 300px"
          allowClear
          class="custom-search"
          @input="handleSearch"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>

        <!-- Bộ lọc Phân loại Tài liệu -->
        <a-select
          v-if="selectedDocumentType === 'TAI_LIEU'"
          v-model:value="selectedSecondMotel"
          placeholder="Phân loại"
          style="width: 150px"
          @change="handleFilterChange"
        >
          <a-select-option value="Giáo trình">Giáo trình</a-select-option>
          <a-select-option value="Sách tham khảo"
            >Sách tham khảo</a-select-option
          >
          <a-select-option value="Khóa luận tốt nghiệp"
            >Khóa luận tốt nghiệp</a-select-option
          >
          <a-select-option value="Báo cáo thực tập"
            >Báo cáo thực tập</a-select-option
          >
          <a-select-option value="Nghiên cứu khoa học"
            >Nghiên cứu khoa học</a-select-option
          >
          <a-select-option value="Bài báo khoa học"
            >Bài báo khoa học</a-select-option
          >
          <a-select-option value="Tài liệu khác">Tài liệu khác</a-select-option>
        </a-select>

        <!-- Bộ lọc trạng thái -->
        <a-select
          v-model:value="selectedStatus"
          placeholder="Trạng thái"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'APPROVED'">Đã duyệt</a-select-option>
          <a-select-option :value="'BLOCKED'">Bị khóa</a-select-option>
          <a-select-option :value="'PENDING'">Chờ duyệt</a-select-option>
        </a-select>

        <!-- Bộ lọc Hiển thị -->
        <a-select
          v-model:value="selectedDel"
          placeholder="Hiển thị"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'false'">Hiển thị</a-select-option>
          <a-select-option :value="'true'">Bị ẩn</a-select-option>
        </a-select>

        <!-- Bộ lọc theo UserId -->
        <a-input
          v-model:value="selectedUserId"
          placeholder="userId..."
          style="width: 90px"
          @input="handleFilterChange"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>
      </div>
    </div>

    <!-- Bảng danh sách bài viết -->
    <a-table
      :columns="columns"
      :data-source="products"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- STT -->
        <template v-if="column.key === 'stt'">
          {{ index + 1 + pagination.pageSize * (pagination.current - 1) }}
        </template>

        <template v-if="column.key === 'firstClass'">
          <span
            :style="{
              color:
                record.accomodationDTO &&
                record.accomodationDTO.firstClass === 'TAI_LIEU'
                  ? 'green'
                  : 'black',
              fontWeight: 'bold',
            }"
          >
            {{
              record.accomodationDTO &&
              record.accomodationDTO.firstClass === "TAI_LIEU"
                ? "Tài liệu"
                : "Không xác định"
            }}
          </span>
        </template>

        <template v-if="column.key === 'secondClass'">
          {{ record.accomodationDTO.secondClass }}
        </template>

        <!-- Tiêu đề -->
        <template v-if="column.key === 'title'">
          {{ record.title }}
        </template>

        <!-- Ngày tạo -->
        <template v-if="column.key === 'createAt'">
          <!-- Thay thế 'T' bằng khoảng trắng -->
          {{
            record.createAt
              ? record.createAt.replace("T", " ")
              : "Không có dữ liệu"
          }}
        </template>

        <!-- Trạng thái duyệt -->
        <template v-if="column.key === 'approved'">
          <a-tag
            :color="
              record.approved && !record.notApproved
                ? 'green'
                : record.approved && record.notApproved
                ? 'orange'
                : 'red'
            "
          >
            {{
              record.approved && !record.notApproved
                ? "Đã duyệt"
                : record.approved && record.notApproved
                ? "Chờ duyệt"
                : "Bị khóa"
            }}
          </a-tag>
        </template>

        <!-- Cột Hiển thị -->
        <template v-if="column.key === 'del'">
          <a-tag :color="record.del ? 'red' : 'green'">
            {{ record.del ? "Bị ẩn" : "Hiển thị" }}
          </a-tag>
        </template>

        <!-- Người đăng -->
        <template v-if="column.key === 'user'">
          {{ record.userDTO ? record.userDTO.fullName : "Không có thông tin" }}
        </template>

        <!-- Hành động -->
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="viewProduct(record)">
            <template #icon><EyeOutlined /></template>
          </a-button>

          <a-button type="link" danger @click="confirmDelete(record)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getListProduct, deleteProduct } from "@/apis/productService";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import DocumentDetail from "./DocumentDetail.vue";

export default {
  components: {
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,

    DocumentDetail,
  },
  setup() {
    const products = ref([]);
    const loading = ref(false);
    const searchText = ref("");
    const selectedStatus = ref(null);
    const pagination = ref({
      current: 1,
      pageSize: 6,
      total: 0,
      showTotal: (total, range) => `Tổng cộng: ${total} bản ghi`,
    });
    const showDocumentDetailPopup = ref(false);
    const selectedProductId = ref(null);
    const selectedUserId = ref(null);
    const selectedDel = ref(null); // Định nghĩa lọc Hiển thị
    const selectedDocumentType = ref(null); // Định nghĩa lọc Loại hình
    const selectedSecondMotel = ref(null);

    // Cấu hình các cột cho bảng
    const columns = [
      { title: "STT", key: "stt" },
      { title: "ID", dataIndex: "id", key: "id" },

      { title: "Tiêu đề", dataIndex: "title", key: "title" },
      { title: "Loại hình", dataIndex: "firstClass", key: "firstClass" },
      { title: "Phân loại", dataIndex: "secondClass", key: "secondClass" },
      { title: "Ngày tạo", dataIndex: "createAt", key: "createAt" },
      { title: "Trạng thái", key: "approved" },
      { title: "Người đăng", key: "user" },
      { title: "Hiển thị", dataIndex: "del", key: "del" }, // Cột hiển thị
      // Cột người đăng
      { title: "Hành động", key: "action", width: 96 },
    ];

    // Fetch danh sách bài viết từ API
    const fetchProducts = async () => {
      loading.value = true;
      try {
        const params = {
          start: Math.max(pagination.value.current - 1, 0),
          limit: pagination.value.pageSize,
          keywords: searchText.value.trim(),
        };

        // Logic lọc trạng thái
        switch (selectedStatus.value) {
          case "APPROVED":
            params.approved = true;
            params.notApproved = false;
            break;
          case "BLOCKED":
            params.approved = false;
            break;
          case "PENDING":
            params.approved = true;
            params.notApproved = true;
            break;
          default:
            break;
        }

        // Lọc theo UserId
        if (selectedUserId.value) {
          params.userId = selectedUserId.value;
        }

        // Lọc theo Hiển thị (del)
        if (selectedDel.value) {
          params.del = selectedDel.value;
        }

        // Lọc theo Loại hình (accomodationDTO.firstClass)

        params.firstClass = "TAI_LIEU";

        if (selectedSecondMotel.value) {
          params.secondClass = selectedSecondMotel.value;
        }

        // Log dữ liệu lọc gửi đi
        console.log("Params gửi đi:", params);
        const res = await getListProduct(params);

        if (res.data && res.data.items) {
          products.value = res.data.items;
          pagination.value.total = res.data.total || 0;
        } else {
          throw new Error("Dữ liệu API không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        message.error(`Lỗi tải danh sách bài viết: ${error.message}`);
      }
      loading.value = false;
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (paginationObj) => {
      pagination.value.current = Math.max(paginationObj.current, 1);
      pagination.value.pageSize = paginationObj.pageSize;
      fetchProducts();
    };

    // Xử lý khi người dùng tìm kiếm
    const handleSearch = () => {
      pagination.value.current = 1;
      fetchProducts();
    };

    // Xử lý khi người dùng thay đổi bộ lọc
    const handleFilterChange = () => {
      pagination.value.current = 1;
      fetchProducts();
    };

    const viewProduct = (record) => {
      selectedProductId.value = record.id;
      showDocumentDetailPopup.value = true;
    };

    // Xác nhận và xóa bài viết
    const confirmDelete = (record) => {
      Modal.confirm({
        title: "Xóa bài viết",
        content: "Bạn có chắc chắn muốn xóa bài viết này?",
        okText: "Xóa",
        cancelText: "Hủy",
        async onOk() {
          try {
            await deleteProduct(record.id);
            message.success("Xóa bài viết thành công");
            fetchProducts();
          } catch {
            message.error("Xóa thất bại");
          }
        },
      });
    };

    onMounted(fetchProducts);

    return {
      products,
      columns,
      loading,
      searchText,
      selectedStatus,
      pagination,
      fetchProducts,
      handleTableChange,
      handleSearch,
      handleFilterChange,
      confirmDelete,
      viewProduct,

      showDocumentDetailPopup,
      selectedProductId,

      selectedUserId,
      selectedDocumentType,
      selectedDel,
      selectedSecondMotel,
    };
  },
};
</script>
