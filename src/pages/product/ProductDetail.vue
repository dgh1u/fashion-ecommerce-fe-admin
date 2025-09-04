<template>
  <a-modal
    v-model:open="modalVisible"
    :footer="null"
    @cancel="handleClose"
    width="800px"
  >
    <div class="create-product space-y-4">
      <!-- Tiêu đề tin đăng -->
      <div class="block flex items-center justify-center">
        <span class="font-bold text-3xl text-stone-500">Chi tiết sản phẩm</span>
      </div>

      <!-- Thông tin Hình thức -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Hình thức</span>
        </div>
        <label> Loại hình <span class="text-red-500">*</span> </label>
        <div class="flex rounded-lg mt-1 p-2">
          <span class="font-bold" :class="classColor">{{ displayClass }}</span>
        </div>

        <!-- Phân loại -->
        <div class="py-2">
          <label>Phân loại</label>
          <div class="flex rounded-lg mt-1 p-2">
            <span class="font-bold">{{
              formData.criteria.secondClass
            }}</span>
          </div>
        </div>

        <!-- Giới tính -->
        <div class="py-2">
          <label>Giới tính</label>
          <div class="flex rounded-lg mt-1 p-2">
            <span class="font-bold">{{
              formData.criteria.gender === true ? 'Nam' : 
              formData.criteria.gender === false ? 'Nữ' : 
              'Không xác định'
            }}</span>
          </div>
        </div>

        <!-- Trạng thái -->
        <div class="py-2">
          <label>Trạng thái</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagStatusColor" class="font-bold">{{
              displayStatus
            }}</a-tag>
          </div>
        </div>
        <!-- Hiển thị -->
        <div class="py-2">
          <label>Hiển thị</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagVisibilityColor" class="font-bold">{{
              displayVisibility
            }}</a-tag>
          </div>
        </div>
      </div>

      <div class="py-2">
        <span class="font-bold text-base">Hình ảnh</span>
      </div>
      <!-- Gallery hình ảnh -->
      <div class="bg-white rounded-xl p-4 text-4xl shadow-lg">
        <div
          v-if="galleryImages.length > 0"
          class="relative w-full h-96 bg-black text-white flex items-center justify-center mb-4 rounded-xl"
        >
          <button
            class="absolute left-0 px-4 py-2 text-3xl"
            @click="prevImage"
            :disabled="galleryImages.length === 0"
          >
            &lt;
          </button>

          <img
            :src="galleryImages[currentImageIndex]"
            alt="gallery image"
            class="max-w-3xl max-h-full max-w-150 object-contain"
          />

          <button
            class="absolute right-0 px-4 py-2 text-3xl"
            @click="nextImage"
            :disabled="galleryImages.length === 0"
          >
            &gt;
          </button>
        </div>
        <!-- Hàng thumbnail, cuộn ngang -->
        <div
          class="flex space-x-2 overflow-x-auto mb-6 items-center justify-center"
        >
          <div
            v-for="(img, index) in galleryImages"
            :key="index"
            @click="currentImageIndex = index"
            class="cursor-pointer flex-shrink-0 w-20 h-20 border rounded"
            :class="{
              'border-blue-500': currentImageIndex === index,
              'border-gray-300': currentImageIndex !== index,
            }"
          >
            <img
              :src="img"
              alt="Thumbnail"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Thông tin mô tả tin đăng -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Thông tin mô tả</span>
        </div>
        <div class="py-2">
          <label>Tiêu đề</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.title"
              type="text"
              placeholder="Nhập tiêu đề"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="py-2">
          <span class="block">Nội dung mô tả</span>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <textarea
              v-model="formData.content"
              placeholder="Nhập nội dung mô tả"
              rows="4"
              class="w-full p-2 mt-1 border-none outline-none rounded-lg bg-gray-50"
              readonly
            ></textarea>
          </div>
        </div>

       

        <!-- Màu sắc -->
        <div class="py-2">
          <label class="block text-gray-700">Màu sắc</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.criteria.color"
              type="text"
              placeholder="Màu sắc sản phẩm"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>

        <!-- Chất liệu -->
        <div class="py-2">
          <label class="block text-gray-700">Chất liệu</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.criteria.material"
              type="text"
              placeholder="Chất liệu sản phẩm"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>

        <!-- Giá bán -->
        <div class="py-2">
          <label class="block text-gray-700">Giá bán</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.criteria.price"
              type="text"
              placeholder="Giá bán"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>

        <!-- Giá gốc -->
        <div class="py-2">
          <label class="block text-gray-700">Giá gốc</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.criteria.originalPrice"
              type="text"
              placeholder="Giá gốc"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
      </div>

      <!-- PHẦN THÔNG TIN SIZE VÀ TỒN KHO -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Số lượng size tồn kho</span>
        </div>

        <div v-if="formData.sizeInventories && formData.sizeInventories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            v-for="sizeInventory in formData.sizeInventories"
            :key="sizeInventory.id"
            class="flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <!-- Size -->
            <div class="text-sm font-semibold text-blue-800 mb-1">
              Size {{ sizeInventory.size?.name || 'N/A' }}
            </div>
            
            <!-- Số lượng -->
            <div class="text-lg font-bold text-blue-600">
              {{ sizeInventory.quantity || 0 }}
            </div>
            
            <!-- Label -->
            <div class="text-xs text-gray-500 mt-1">
              {{ sizeInventory.quantity > 0 ? 'Còn hàng' : 'Hết hàng' }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-lg">Không có thông tin tồn kho size</div>
          <div class="text-sm mt-1">Sản phẩm có thể không phải là quần áo hoặc chưa có dữ liệu tồn kho</div>
        </div>

        <!-- Tổng tồn kho -->
        <div v-if="formData.sizeInventories && formData.sizeInventories.length > 0" class="mt-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Tổng tồn kho:</span>
            <span class="font-bold text-lg text-green-600">
              {{ totalInventory }} sản phẩm
            </span>
          </div>
        </div>
      </div>

     
      <!-- Các nút hành động -->
      <div class="pt-10" v-if="displayStatus === 'Chờ duyệt'">
        <div class="flex space-x-5">
          <div class="flex-1 text-white font-semibold">
            <button
              @click="handleBlock"
              class="px-3 py-2 bg-red-500 text-white rounded-lg w-full"
            >
              Khóa bài
            </button>
          </div>
          <div class="flex-1 text-white font-semibold">
            <button
              @click="handleApprove"
              class="px-3 py-2 bg-green-500 text-white rounded-lg w-full"
            >
              Duyệt bài
            </button>
          </div>
        </div>
      </div>
      <div class="pt-10" v-else-if="displayStatus === 'Đã duyệt'">
        <div class="flex text-white font-semibold">
          <button
            @click="handleBlock"
            class="w-full px-3 py-2 bg-red-500 text-white rounded-lg"
          >
            Khóa bài
          </button>
        </div>
      </div>
      <div class="pt-10" v-else-if="displayStatus === 'Bị khóa'">
        <div class="flex text-white font-semibold">
          <button
            @click="handleApprove"
            class="w-full px-3 py-2 bg-green-500 text-white rounded-lg"
          >
            Mở khóa
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  defineProps,
  defineEmits,
} from "vue";
import { message } from "ant-design-vue";
import { Check as CheckIcon } from "lucide-vue-next";
import { getDetailProduct, approveProduct } from "@/apis/productService.js";


const products = ref([]);

const props = defineProps({
  open: { type: Boolean, default: false },
  productId: { type: [String, Number], default: "" },
});
const emit = defineEmits(["update:open"]);

const modalVisible = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Biến chứa danh sách URL hình ảnh dạng gallery
const galleryImages = ref([]);

// Biến điều hướng ảnh
const currentImageIndex = ref(0);
const nextImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % galleryImages.value.length;
  }
};
const prevImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + galleryImages.value.length) %
      galleryImages.value.length;
  }
};

// Dữ liệu form
const formData = reactive({
  title: "",
  content: "",

  approved: false,
  notApproved: false,
  del: false,
  sizeInventories: [],
  criteria: {
    firstClass: "",
    secondClass: "",
    gender: "",
    color: "",
    material: "",
      price: "",
  originalPrice: "",
    address: "",
    idDistrict: "",
    openHours: "",
    airConditioner: false,
    linkShopeeFood: "",
    internet: false,
    delivery: false,
    parking: false,
    dineIn: false,
    takeAway: false,
    bigSpace: false,
  },
});

// Bản đồ
const mapAddress = ref("");
const addressTimer = ref(null);

watch(
  () => formData.criteria.address,
  (newAddress) => {
    if (addressTimer.value) clearTimeout(addressTimer.value);
    addressTimer.value = setTimeout(() => {
      mapAddress.value = newAddress;
    }, 1000);
  }
);

// Computed property hiển thị Hình thức
const displayClass = computed(() => {
  if (formData.criteria.firstClass === "QUAN_AO") return "Quần áo";
   if (formData.criteria.firstClass === "TUI_XACH") return "Túi xách";
    if (formData.criteria.firstClass === "PHU_KIEN") return "Phụ kiện";
     

  return formData.criteria.firstClass;
});

// Computed property cho trạng thái bài đăng
const displayStatus = computed(() => {
  if (formData.approved === true && formData.notApproved === false) {
    return "Đã duyệt";
  } else if (formData.approved === true && formData.notApproved === true) {
    return "Chờ duyệt";
  } else if (formData.approved === false) {
    return "Bị khóa";
  }
  return "";
});

// Computed property cho hiển thị: nếu del=false: "Hiển thị", nếu del=true: "Bị ẩn"
const displayVisibility = computed(() => (formData.del ? "Bị ẩn" : "Hiển thị"));

// Computed property định nghĩa màu chữ cho Hình thức
const classColor = computed(() => {
  if (formData.criteria.firstClass === "TAI_LIEU") return "text-green-500";

  return "";
});

// Computed property định nghĩa màu cho Trạng thái (Tag của antd)
const tagStatusColor = computed(() => {
  if (displayStatus.value === "Đã duyệt") return "green";
  if (displayStatus.value === "Chờ duyệt") return "gold";
  if (displayStatus.value === "Bị khóa") return "red";
  return "";
});

// Computed property định nghĩa màu cho Hiển thị (Tag của antd)
const tagVisibilityColor = computed(() => {
  if (displayVisibility.value === "Hiển thị") return "green";
  if (displayVisibility.value === "Bị ẩn") return "red";
  return "";
});

// Computed property tính tổng tồn kho
const totalInventory = computed(() => {
  if (!formData.sizeInventories || formData.sizeInventories.length === 0) {
    return 0;
  }
  return formData.sizeInventories.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
});

// Hàm tải tài liệu đã được cập nhật để sử dụng API downloadDoc
async function handleProductClick(doc) {
  try {
    console.log("💾 Tải tài liệu:", doc.file_name);
    console.log("🆔 Product ID:", doc.id);

    // Gọi API downloadDoc thay vì fetch trực tiếp
    const response = await downloadDoc(doc.id);

    console.log("📡 Response:", response);
    console.log("📡 Response type:", typeof response);
    console.log("📡 Is Blob:", response instanceof Blob);

    let blob;
    let downloadFileName = doc.fileName; // Fallback filename

    // Kiểm tra nếu response là Blob trực tiếp
    if (response instanceof Blob) {
      blob = response;
      console.log(
        "📦 Direct blob - size:",
        blob.size,
        "bytes, type:",
        blob.type
      );
    } else if (response.data) {
      // Nếu response có structure thông thường
      console.log("📡 Response headers:", response.headers);

      // Lấy filename từ Content-Disposition header nếu có
      if (response.headers && response.headers["content-disposition"]) {
        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          downloadFileName = fileNameMatch[1].replace(/['"]/g, "");
          console.log("📝 Filename từ header:", downloadFileName);
        }
      }

      // Kiểm tra xem response.data có hợp lệ không
      if (!response.data) {
        throw new Error("API không trả về dữ liệu file");
      }

      // Tạo blob từ response data
      blob = new Blob([response.data]);
    } else {
      throw new Error("Response format không được hỗ trợ");
    }

    console.log("📦 Final blob size:", blob.size, "bytes");
    console.log("📝 Download filename:", downloadFileName);

    if (blob.size === 0) {
      throw new Error("File rỗng");
    }

    // Tạo URL tạm từ blob và tải về
    const url = window.URL.createObjectURL(blob);
    const link = product.createElement("a");
    link.href = url;
    link.download = downloadFileName; // ⭐ Quan trọng: download attribute
    link.style.display = "none"; // Ẩn link

    // Thêm vào DOM, click, rồi xóa ngay
    product.body.appendChild(link);
    link.click();
    product.body.removeChild(link);

    // Cleanup URL sau 1 giây
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      console.log("🗑️ Cleaned up blob URL");
    }, 1000);

    message.success(
      `Đã tải về: ${downloadFileName} (${(blob.size / 1024 / 1024).toFixed(
        1
      )}MB)`
    );
  } catch (error) {
    console.error("❌ Lỗi tải file:", error);
    message.error(`Không thể tải file: ${error.message}`);
  }
}

function getFileTypeText(fileTypeOrName) {
  if (typeof fileTypeOrName === "string") {
    const lower = fileTypeOrName.toLowerCase();
    if (lower.includes("pdf")) return "PDF Product";
    if (lower.includes("word")) return "Word Product";
    if (lower.includes("presentation")) return "PowerPoint";
    if (lower.includes("spreadsheet")) return "Excel";
    if (lower.includes("x-zip-compressed")) return "Zip";
  }
  return "Product";
}

// Hàm duyệt bài
const handleApprove = async () => {
  try {
    await approveProduct(props.productId, true);
    message.success("Bài đăng đã được duyệt");
    fetchProductDetails(props.productId);
  } catch (error) {
    console.error("Lỗi duyệt bài:", error);
    message.error("Lỗi duyệt bài");
  }
};

// Hàm khóa bài
const handleBlock = async () => {
  try {
    await approveProduct(props.productId, false);
    message.success("Bài đăng đã bị khóa");
    fetchProductDetails(props.productId);
  } catch (error) {
    console.error("Lỗi khóa bài:", error);
    message.error("Lỗi khóa bài");
  }
};

// Hàm lấy chi tiết bài đăng
const fetchProductDetails = async (id) => {
  try {
    const response = await getDetailProduct(id);
    const data = response.data || {};
    
    formData.title = data.title || "";
    formData.content = data.content || "";
    formData.approved = data.approved ?? false;
    formData.notApproved = data.notApproved ?? false;
    formData.del = data.del ?? false;
    
    // Handle size inventories - check both possible field names
    formData.sizeInventories = data.sizeInventories || data.inventories || [];
    
    if (data.criteriaDTO) {
      Object.assign(formData.criteria, data.criteriaDTO);
      if (data.criteriaDTO.district && data.criteriaDTO.district.id) {
        formData.criteria.idDistrict = data.criteriaDTO.district.id;
      }
    }
    
 
    
    // Nếu API trả về mảng hình ảnh thì cập nhật lại galleryImages
    if (data.imageStrings) {
      galleryImages.value = data.imageStrings;
      // Reset currentImageIndex về 0 nếu cần
      currentImageIndex.value = 0;
    }
    products.value = data.products || [];
  } catch (error) {
    console.error("Lỗi tải thông tin bài đăng:", error);
    message.error("Không thể tải thông tin bài đăng.");
  }
};

onMounted(() => {
  if (props.productId) {
    fetchProductDetails(props.productId);
  }
});

watch(
  () => props.productId,
  (newProductId, oldProductId) => {
    if (newProductId && newProductId !== oldProductId) {
      fetchProductDetails(newProductId);
    }
  }
);

const handleClose = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.submit-btn:hover {
  background-color: #2980b9;
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
