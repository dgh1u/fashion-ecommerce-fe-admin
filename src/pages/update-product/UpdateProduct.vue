<template>
  <div class="update-product max-w-3xl mx-auto space-y-4">
    <div class="flex items-center pb-4 justify-center">
      <span class="font-bold text-3xl text-black">Cập nhật sản phẩm</span>
    </div>
    
    <!-- Loading state -->
    <div v-if="dataLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Đang tải dữ liệu sản phẩm...</span>
    </div>

    <!-- Content when loaded -->
    <template v-else>
    
    <div class="block bg-white p-4 pb-6 rounded-xl">
      <div class="py-2">
        <span class="font-bold text-base">Phân loại</span>
      </div>

      <!-- Chọn loại hình (firstClass) -->
      <label>Loại hình <span class="text-red-500">*</span> </label>
      <div class="flex rounded-lg mt-1">
        <a-select
          :value="formData.criteria.firstClass"
          @change="(value) => {
            formData.criteria.firstClass = value;
            formData.criteria.secondClass = '';
          }"
          placeholder="Chọn loại hình"
          class="w-full"
        >
          <a-select-option value="QUAN_AO">Quần áo</a-select-option>
  
          <a-select-option value="TUI_XACH">Túi xách</a-select-option>
          <a-select-option value="PHU_KIEN">Phụ kiện</a-select-option>
        </a-select>
      </div>

      <!-- Chọn phân loại chi tiết (secondClass) -->
      <div class="pt-4">
        <label>{{ getSecondClassLabel() }} <span class="text-red-500">*</span> </label>
        <div class="flex rounded-lg mt-1">
          <a-select
            :value="formData.criteria.secondClass"
            @change="(value) => (formData.criteria.secondClass = value)"
            :placeholder="getSecondClassPlaceholder()"
            class="w-full"
          >
            <a-select-option 
              v-for="option in getSecondClassOptions()" 
              :key="option" 
              :value="option"
            >
              {{ option }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <!-- Chỉ hiển thị giới tính cho quần áo -->
      <div class="pt-4">
        <label>Giới tính <span class="text-red-500">*</span> </label>
        <div class="flex rounded-lg mt-1">
          <a-select
            :value="formData.criteria.gender === true ? 'true' : formData.criteria.gender === false ? 'false' : 'null'"
            @change="(value) => {
              if (value === 'true') formData.criteria.gender = true;
              else if (value === 'false') formData.criteria.gender = false;
              else formData.criteria.gender = null;
            }"
            placeholder="Chọn giới tính"
            class="w-full"
          >
            <a-select-option value="true">Nam</a-select-option>
            <a-select-option value="false">Nữ</a-select-option>
            <a-select-option value="null">Không yêu cầu</a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <div class="block bg-white p-4 rounded-xl">
      <div class="py-2">
        <span class="font-bold text-base">Thông tin mô tả</span>
      </div>
      <div class="py-2">
        <label>Tiêu đề <span class="text-red-500">*</span></label>
        <div class="flex border border-gray-300 rounded-lg mt-1">
          <input
            v-model="formData.title"
            type="text"
            placeholder="Nhập tiêu đề"
            class="w-full p-2 border-none outline-none rounded-lg"
          />
        </div>
      </div>

      <div class="py-2">
        <span class="block"
          >Nội dung mô tả <span class="text-red-500">*</span></span
        >
        <div class="flex border border-gray-300 rounded-lg mt-1">
          <textarea
            v-model="formData.content"
            placeholder="Nhập nội dung mô tả"
            rows="4"
            class="w-full p-2 mt-1 border-none outline-none rounded-lg"
          />
        </div>
      </div>

      <div class="py-2">
        <label>Giá (sau khi giảm giá)<span class="text-red-500">*</span></label>
        <div class="flex border border-gray-300 rounded-lg mt-1 w-120">
          <input
            v-model.number="formData.criteria.price"
            type="number"
            placeholder="VD: 1000000 (cho 1 triệu)"
            class="w-full p-2 border-none outline-none rounded-lg"
          />
          <span class="p-2 border-l border-gray-300">đồng</span>
        </div>
        <small class="text-gray-500"
          >Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000</small
        >
      </div>

      <div class="py-2">
        <label class="block text-gray-700"
          >Giá gốc <span class="text-red-500">*</span></label
        >
        <div
          class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
        >
          <input
            v-model.number="formData.criteria.originalPrice"
            type="number"
            placeholder="VD: 3500"
            class="w-full p-2 border-none outline-none rounded-lg"
          />
          <span class="p-2 border-l border-gray-300">đồng</span>
        </div>
        <small class="text-gray-500">
          Khi hiển thị trên giao diện người dùng sẽ là
          <span class="line-through">100.000</span>đ
        </small>
      </div>
      
      <!-- Chỉ hiển thị màu sắc và chất liệu cho quần áo -->
      <div v-if="formData.criteria.firstClass === 'QUAN_AO'" class="py-2">
        <label>Màu sắc <span class="text-red-500">*</span></label>
        <div class="flex rounded-lg mt-1">
          <a-select
            :value="formData.criteria.color"
            @change="(value) => (formData.criteria.color = value)"
            placeholder="Chọn màu sắc"
            class="w-full"
          >
            <a-select-option
              v-for="color in colorList"
              :key="color.id"
              :value="color.name"
            >
              {{ color.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      
      <div v-if="formData.criteria.firstClass === 'QUAN_AO'" class="py-2">
        <label>Chất liệu chính <span class="text-red-500">*</span></label>
        <div class="flex rounded-lg mt-1">
          <a-select
            :value="formData.criteria.material"
            @change="(value) => (formData.criteria.material = value)"
            placeholder="Chọn chất liệu"
            class="w-full"
          >
            <a-select-option
              v-for="material in materialList"
              :key="material.id"
              :value="material.name"
            >
              {{ material.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <!-- Size và Inventory Form - chỉ hiển thị cho quần áo -->
    <div v-if="formData.criteria.firstClass === 'QUAN_AO'" class="block bg-white p-4 rounded-xl">
      <SizeInventoryForm
        v-model="inventoryData"
        @validate="handleInventoryValidation"
        ref="sizeInventoryRef"
        :key="`inventory-${productId}-${Object.keys(inventoryData).length}`"
      />
    </div>

    <!-- Hình ảnh -->
    <div class="block bg-white p-4 rounded-xl">
      <div class="py-2 pb-6">
        <span class="font-bold text-base">Hình ảnh</span>
      </div>

      <!-- Multiple Image Upload Box -->
      <div class="mb-4">
        <div
          class="relative border-2 border-dashed border-blue-500 rounded-lg h-48 flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 transition bg-blue-50"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2"
            >
              <FolderUp class="w-8 h-8 text-blue-500" />
            </div>
            <span class="text-gray-700 font-medium">Tải ảnh từ thiết bị</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleMultipleFileChange"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <!-- Upload Requirements -->
      <div class="mb-4 text-sm text-gray-600">
        <div>• Tải lên tối đa 8 ảnh trong một bài đăng</div>
        <div>• Dung lượng ảnh tối đa 10MB</div>
        <div>• Hình ảnh phải liên quan đến sản phẩm</div>
        <div>• Không chèn văn bản, số điện thoại lên ảnh</div>
      </div>

      <!-- Uploaded Images Display -->
      <div v-if="uploadedImages.length > 0" class="grid grid-cols-2 gap-4">
        <div
          v-for="(image, index) in uploadedImages"
          :key="index"
          class="relative h-32 rounded-lg overflow-hidden border"
        >
          <img
            :src="image.preview"
            alt="preview"
            class="w-full h-full object-cover"
          />
          <button
            @click="removeUploadedImage(index)"
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-90 rounded-md text-red-500 hover:text-red-600 text-xs"
          >
            <Trash2 class="w-3 h-3" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      <!-- Image Counter -->
      <div class="mt-4 text-sm text-gray-600 text-center">
        Đã chọn: {{ uploadedImages.length }}/8 ảnh
        <span v-if="uploadedImages.length < 2" class="text-red-500">
          (Tối thiểu 2 ảnh)
        </span>
      </div>
    </div>

    <div class="text-white font-semibold mt-4">
      <button
        class="submit-btn bg-sky-500 px-4 py-2 rounded hover:bg-sky-600 w-full flex items-center justify-center"
        :disabled="loading"
        @click="handleUpdateProduct"
      >
        <div
          v-if="loading"
          class="loader mr-2 animate-spin rounded-full h-5 w-5 border-b-2 border-white"
        ></div>
        <span>
          <span v-if="!loading">Cập nhật bài đăng</span>
          <span v-if="loading">Đang cập nhật...</span>
        </span>
      </button>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductById, updateProduct } from "@/apis/productService.js";
import {
  getImageDTOByProduct,
  deleteImagesByProduct,
  uploadMultipleImages,
} from "@/apis/imageService.js";
import { updateProductInventory } from "@/apis/sizeService.js";
import { FolderUp, Trash2 } from "lucide-vue-next";

// Import các component của Ant Design Vue
import { Select, message, Modal } from "ant-design-vue";

const { confirm } = Modal;
const { Option: ASelectOption } = Select;
import SizeInventoryForm from "@/components/SizeInventoryForm.vue";

// Import các component của Ant Design Vue trực tiếp trong setup
const ASelect = Select;
const ASelectOptionComponent = ASelectOption;

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

// Thêm reactive data cho inventory
const inventoryData = ref({});
const isInventoryValid = ref(false);
const sizeInventoryRef = ref(null);

// Khai báo các biến reactive
const formData = reactive({
  title: "",
  content: "",
  criteria: {
    firstClass: "QUAN_AO",
    price: "",
    originalPrice: "",
    gender: "",
    color: "",
    material: "",
    secondClass: "",
    size: null, // Thêm field size
  },
});

const colorList = ref([
  { id: 1, name: "Đỏ" },
  { id: 2, name: "Xanh" },
  { id: 3, name: "Vàng" },
  { id: 4, name: "Trắng" },
  { id: 5, name: "Đen" },
]);

const materialList = ref([
  { id: 1, name: "Cotton" },
  { id: 2, name: "Polyester" },
  { id: 3, name: "Nylon" },
  { id: 4, name: "Jean" },
  { id: 5, name: "Spandex" },
  { id: 6, name: "Satin" },
]);

const loading = ref(false);
const dataLoading = ref(true); // Thêm loading state riêng cho việc load dữ liệu

// Replace single imageBox with multiple uploadedImages
const uploadedImages = ref([]);

// Handle multiple file upload
const handleMultipleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  // Kiểm tra tổng số ảnh không vượt quá 8
  if (uploadedImages.value.length + selectedFiles.length > 8) {
    message.error(
      `Bạn chỉ có thể tải lên tối đa 8 ảnh. Hiện tại đã có ${uploadedImages.value.length} ảnh.`
    );
    e.target.value = null;
    return;
  }

  // Kiểm tra từng file
  for (const file of selectedFiles) {
    if (file.size > 10 * 1024 * 1024) {
      message.error(`File "${file.name}" vượt quá 10MB`);
      e.target.value = null;
      return;
    }
  }

  // Thêm các file mới vào array
  selectedFiles.forEach((file) => {
    uploadedImages.value.push({
      file: file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    });
  });

  e.target.value = null;
};

/**
 * Xóa ảnh ở một index cụ thể
 */
const removeUploadedImage = (index) => {
  if (uploadedImages.value[index]) {
    if (uploadedImages.value[index].preview && !uploadedImages.value[index].isExisting) {
      URL.revokeObjectURL(uploadedImages.value[index].preview);
    }
    uploadedImages.value.splice(index, 1);
  }
};

// Helper function to convert base64 to file
function base64ToFile(base64, fileName, fileType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: fileType });
}

/**
 * onMounted: Lấy chi tiết sản phẩm và load dữ liệu hiện có
 */
onMounted(async () => {
  dataLoading.value = true;
  
  try {
    // 1) Lấy detail product
    const resp = await getProductById(productId);
    const data = resp.data;

    formData.title = data.title;
    formData.content = data.content;

    if (data.criteriaDTO) {
      Object.assign(formData.criteria, data.criteriaDTO);
    }

    // 2) Load ảnh cũ (nhiều ảnh)
    const imgRes = await getImageDTOByProduct(productId);
    console.log("Response từ getImageDTOByProduct:", imgRes);

    if (imgRes && Array.isArray(imgRes) && imgRes.length > 0) {
      // Load tất cả ảnh, không chỉ ảnh đầu tiên
      uploadedImages.value = imgRes.map((img) => {
        const previewUrl = `data:${img.fileType};base64,${img.uri}`;
        return {
          id: img.id,
          fileName: img.fileName,
          fileType: img.fileType,
          base64: img.uri,
          preview: previewUrl,
          isExisting: true,
        };
      });
    }

    // 3) Load inventory data từ inventories trong product data
    if (data.inventories) {
      // Load sizes để có mapping
      try {
        const { getAllSizes } = await import("@/apis/sizeService.js");
        const sizesResponse = await getAllSizes();
        
        if (sizesResponse.success) {
          const inventory = {};
          
          // Map inventory data by size ID từ data.inventories
          data.inventories.forEach((item) => {
            const sizeId = item.size?.id;
            const quantity = item.quantity;
            
            if (sizeId && quantity !== undefined) {
              inventory[sizeId] = quantity;
            }
          });
          
          inventoryData.value = inventory;
          
          // Trigger validation sau khi load data
          setTimeout(() => {
            if (sizeInventoryRef.value) {
              isInventoryValid.value = Object.values(inventory).some(qty => Number(qty) > 0);
            }
          }, 100);
        }
      } catch (error) {
        console.error("❌ Error loading sizes:", error);
      }
    }

  } catch (error) {
    console.error("❌ CRITICAL ERROR loading product data:", error);
    message.error("Không thể tải dữ liệu sản phẩm.");
  } finally {
    dataLoading.value = false;
  }
});

const buildPayload = () => {
  // Thêm một size representative để tránh lỗi null pointer trong backend
  const payload = {
    ...formData,
    inventory: inventoryData.value,
  };
  
  // Đảm bảo criteria có size để tránh lỗi null pointer
  if (formData.criteria.firstClass === 'QUAN_AO') {
    // Lấy size ID đầu tiên từ inventory hoặc dùng size mặc định
    const firstSizeId = Object.keys(inventoryData.value)[0] || 1;
    payload.criteria.size = {
      id: parseInt(firstSizeId),
      name: "Representative Size" // Size đại diện, vì inventory được quản lý riêng cho từng size
    };
  }
  
  return payload;
};

/**
 * Thực hiện cập nhật bài đăng
 */
async function executeUpdateProduct() {
  loading.value = true;
  try {
    console.log("Cập nhật bài đăng với payload:", buildPayload());
    console.log("Inventory data:", inventoryData.value);
    
    // 1. Cập nhật thông tin sản phẩm bao gồm inventory
    await updateProduct(productId, buildPayload());
    console.log("Cập nhật bài đăng và inventory thành công.");

    // 2. Xoá toàn bộ ảnh cũ trên server
    await deleteImagesByProduct(productId);

    // 3. Upload multiple images
    const filesToUpload = uploadedImages.value.map((img) => {
      return img.isExisting
        ? base64ToFile(img.base64, img.fileName, img.fileType)
        : img.file;
    });

    if (filesToUpload.length > 0) {
      await uploadMultipleImages(productId, filesToUpload);
    }

    message.success("Cập nhật bài đăng thành công!");
    router.push(`/product/${productId}`);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật bài đăng:", error);
    message.error("Đã có lỗi xảy ra khi cập nhật bài đăng");
  } finally {
    loading.value = false;
  }
}

const handleUpdateProduct = () => {
  // Validate số lượng ảnh (ít nhất 2 ảnh)
  if (uploadedImages.value.length < 2) {
    message.error("Bạn phải tải lên ít nhất 2 ảnh");
    return;
  }
  if (uploadedImages.value.length > 8) {
    message.error("Bạn chỉ được tải lên tối đa 8 ảnh");
    return;
  }

  // Validate inventory
  if (!isInventoryValid.value) {
    message.error("Vui lòng nhập số lượng tồn kho cho ít nhất 1 size");
    return;
  }

  // Validate tiêu đề:
  if (!formData.title.trim()) {
    message.error("Tiêu đề không được để trống");
    return;
  }
  if (
    formData.title.trim().length < 10 ||
    formData.title.trim().length > 50
  ) {
    message.error("Tiêu đề phải từ 10 đến 50 ký tự");
    return;
  }

  // Validate nội dung mô tả:
  if (!formData.content.trim()) {
    message.error("Nội dung mô tả không được để trống");
    return;
  }
  if (
    formData.content.trim().length < 50 ||
    formData.content.trim().length > 500
  ) {
    message.error("Nội dung mô tả phải từ 50 đến 500 ký tự");
    return;
  }

  // Validate các trường bắt buộc chung
  if (!formData.criteria.price) {
    message.error("Giá sản phẩm không được để trống");
    return;
  }
  if (!formData.criteria.originalPrice) {
    message.error("Giá gốc không được để trống");
    return;
  }
  if (!formData.criteria.secondClass) {
    message.error(`${getSecondClassLabel()} không được để trống`);
    return;
  }
  
  // Validate các trường bắt buộc cho quần áo
  if (formData.criteria.firstClass === 'QUAN_AO') {
    if (
      formData.criteria.gender === "" ||
      formData.criteria.gender === undefined
    ) {
      message.error("Giới tính không được để trống");
      return;
    }
    if (!formData.criteria.color) {
      message.error("Màu sắc không được để trống");
      return;
    }
    if (!formData.criteria.material) {
      message.error("Chất liệu không được để trống");
      return;
    }
    
    // Validate inventory cho quần áo
    if (!isInventoryValid.value) {
      message.error("Vui lòng nhập số lượng tồn kho cho ít nhất một size");
      return;
    }
  }

  // Hiển thị confirm trước khi cập nhật
  confirm({
    title: "Xác nhận cập nhật bài đăng",
    content: "Bạn có chắc chắn muốn cập nhật bài đăng này không?",
    async onOk() {
      await executeUpdateProduct();
    },
    onCancel() {
      message.info("Đã hủy cập nhật");
    },
  });
};

// Xử lý inventory validation
const handleInventoryValidation = (isValid) => {
  isInventoryValid.value = isValid;
};

// Methods for handling firstClass and secondClass
const getSecondClassLabel = () => {
  switch (formData.criteria.firstClass) {
    case 'QUAN_AO':
      return 'Loại quần áo';

    case 'TUI_XACH':
      return 'Loại túi xách';
    case 'PHU_KIEN':
      return 'Loại phụ kiện';
    default:
      return 'Phân loại';
  }
};

const getSecondClassPlaceholder = () => {
  switch (formData.criteria.firstClass) {
    case 'QUAN_AO':
      return 'Chọn loại quần áo';

    case 'TUI_XACH':
      return 'Chọn loại túi xách';
    case 'PHU_KIEN':
      return 'Chọn loại phụ kiện';
    default:
      return 'Chọn phân loại';
  }
};

const getSecondClassOptions = () => {
  switch (formData.criteria.firstClass) {
    case 'QUAN_AO':
      return [
        'Áo thun',
        'Áo sơ mi',
        'Áo kiểu',
        'Áo khoác',
        'Quần dài',
        'Quần ngắn',
        'Váy',
        'Đồ lót',
        'Đồ mặc nhà'
      ];
   
    case 'TUI_XACH':
      return [
        'Ví',
        'Túi xách',
        'Balo',
        'Vali'
      ];
    case 'PHU_KIEN':
      return [
        'Nón&Mũ',
        'Khăn Choàng',
        'Tất',
        'Găng tay'
      ];
    default:
      return [];
  }
};

// Watch inventory data changes to force update component
watch(() => inventoryData.value, (newData, oldData) => {
  if (sizeInventoryRef.value && Object.keys(newData).length > 0) {
    // Force component to re-validate
    nextTick(() => {
      const hasValidQuantity = Object.values(newData).some(qty => Number(qty) > 0);
      isInventoryValid.value = hasValidQuantity;
    });
  }
}, { deep: true, immediate: true });
</script>
<style scoped>
.submit-btn:hover {
  background-color: #2980b9;
}
.loader {
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #3498db; /* Blue */
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
