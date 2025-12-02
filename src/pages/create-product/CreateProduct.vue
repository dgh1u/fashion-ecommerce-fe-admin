<template>
  <div class="create-product max-w-3xl mx-auto space-y-4">
    <div class="flex items-center pb-4 justify-center">
      <span class="font-bold text-3xl text-black pt-6">Đăng tải sản phẩm</span>
    </div>
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
            :value="formData.criteria.gender"
            @change="(value) => (formData.criteria.gender = value)"
            placeholder="Chọn giới tính"
            class="w-full"
          >
            <a-select-option :value="true">Nam</a-select-option>
            <a-select-option :value="false">Nữ</a-select-option>
            <a-select-option :value="null">Không yêu cầu</a-select-option>
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
      <div  class="py-2">
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
      
      <div  class="py-2">
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
    <div
      
      class="block bg-white p-4 rounded-xl"
    >
      <SizeInventoryForm
        v-model="inventoryData"
        @validate="handleInventoryValidation"
        ref="sizeInventoryRef"
      />
    </div>

    <!-- Hình ảnh -->
    <div class="block bg-white p-4 rounded-xl">
      <div class="py-2 pb-6">
        <span class="font-bold text-base">Hình ảnh</span>
      </div>

      <!-- Single Image Upload Box -->
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

      <!-- Uploaded Images Display with Sorting -->
      <ImageSorter
        :images="uploadedImages"
        @update:images="uploadedImages = $event"
        @remove-image="removeUploadedImage"
        @order-changed="handleImageOrderChanged"
      />

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
        @click="handleCreateProduct"
      >
        <div
          v-if="loading"
          class="loader mr-2 animate-spin rounded-full h-5 w-5 border-b-2 border-white"
        ></div>
        <span>
          <span v-if="!loading">Đăng tin</span>
          <span v-if="loading">Đang tạo...</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { createProduct } from "@/apis/productService.js";
import { uploadMultipleImages } from "@/apis/imageService.js";

// Import các component của Ant Design Vue
import { Select, message, Spin, Modal } from "ant-design-vue";

const { confirm } = Modal;

const { Option: ASelectOption } = Select;
import { Check as CheckIcon, FolderUp, Trash2 } from "lucide-vue-next";

import SizeInventoryForm from "@/components/SizeInventoryForm.vue";
import ImageSorter from "@/components/ImageSorter.vue";

// Import các component của Ant Design Vue trực tiếp trong setup
const ASelect = Select;
const ASelectOptionComponent = ASelectOption;
const ASpin = Spin;

const file = ref(null);

// Thêm vào reactive data
const selectedDocuments = ref([]);

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
    interior: "",

    secondClass: "",
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

const featureOptionsMotel = ref([
  { label: "Đầy đủ nội thất", value: "interior" },
  { label: "Có điều hòa", value: "airConditioner" },
  { label: "Có nóng lạnh", value: "heater" },
  { label: "Có internet", value: "internet" },
  { label: "Vệ sinh khép kín", value: "toilet" },
  { label: "Giờ giấc tự do", value: "time" },
  { label: "Có chỗ để xe", value: "parking" },
  { label: "An ninh tốt", value: "security" },
  { label: "Không chung chủ", value: "owner" },
  { label: "Kệ bếp", value: "kitchen" },
]);

const featureOptionsStore = ref([
  { label: "Có giao hàng", value: "delivery" },
  { label: "Phục vụ tại chỗ", value: "dineIn" },
  { label: "Mua mang đi", value: "takeAway" },
  { label: "Không gian rộng", value: "bigSpace" },
  { label: "Có chỗ để xe", value: "parking" },
  { label: "Có điều hòa", value: "airConditioner" },
  { label: "Wifi miễn phí", value: "internet" },
]);

const mapAddress = ref("");
const addressTimer = ref(null);
const loading = ref(false);

// Computed properties
const displayMapAddress = computed(() => {
  return mapAddress.value.trim() || "VNUA";
});

// Watchers
watch(
  () => formData.criteria.address,
  (newAddress) => {
    if (addressTimer.value) clearTimeout(addressTimer.value);
    addressTimer.value = setTimeout(() => {
      mapAddress.value = newAddress;
    }, 1000);
  }
);

// Computed property to check if all 4 images are required based on property type
const isImagesRequired = computed(() => {
  return (
    formData.criteria.firstClass === "PHONG_TRO" ||
    formData.criteria.firstClass === "O_GHEP" ||
    formData.criteria.firstClass === "QUAN_AN" ||
    formData.criteria.firstClass === "QUAN_NUOC" ||
    formData.criteria.firstClass === "CUA_HANG" ||
    formData.criteria.firstClass === "TIEN_ICH"
  );
});

// Thay đổi từ files array thành uploadedImages
const uploadedImages = ref([]);

// Thay thế files ref
// const files = ref([null, null, null, null]);

// Thay đổi handle file change
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
    });
  });

  e.target.value = null;
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

const removeUploadedImage = (index) => {
  if (uploadedImages.value[index]) {
    URL.revokeObjectURL(uploadedImages.value[index].preview);
    uploadedImages.value.splice(index, 1);
  }
};

// Xử lý thay đổi thứ tự ảnh (trong CreateProduct, chỉ cần update local array)
const handleImageOrderChanged = (reorderedImages) => {
  // Trong trang tạo mới, chỉ cần cập nhật thứ tự local
  // Thứ tự sẽ được duy trì khi upload lên server
  console.log('Thứ tự ảnh đã được thay đổi:', reorderedImages);
};

const handleTimeChange = (time) => {
  if (time && Array.isArray(time) && time.length === 2) {
    const formatTime = (timeValue) => {
      if (!timeValue) return "";
      const date = new Date(timeValue);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const startTime = formatTime(time[0]);
    const endTime = formatTime(time[1]);

    // Lưu trực tiếp dưới dạng chuỗi
    formData.criteria.openHours = `${startTime} - ${endTime}`;
  }
};

const handleCreateProduct = () => {
  // Validate số lượng ảnh (2-8 ảnh)
  if (uploadedImages.value.length < 2) {
    message.error("Bạn phải tải lên ít nhất 2 ảnh");
    return;
  }
  if (uploadedImages.value.length > 8) {
    message.error("Bạn chỉ được tải lên tối đa 8 ảnh");
    return;
  }

  // Validate cho QUAN_AO
  if (formData.criteria.firstClass === "QUAN_AO") {
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

    // Validate các trường bắt buộc cho quần áo
    if (!formData.criteria.price) {
      message.error("Giá sản phẩm không được để trống");
      return;
    }
    if (!formData.criteria.originalPrice) {
      message.error("Giá gốc không được để trống");
      return;
    }
    if (!formData.criteria.secondClass) {
      message.error("Loại quần áo không được để trống");
      return;
    }
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
  }
  
  // Validate cho các loại sản phẩm khác (TUI_XACH, PHU_KIEN)
  if ([ "TUI_XACH", "PHU_KIEN"].includes(formData.criteria.firstClass)) {
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
  }

  if (
    formData.criteria.firstClass === "QUAN_AN" ||
    formData.criteria.firstClass === "QUAN_NUOC" ||
    formData.criteria.firstClass === "CUA_HANG" ||
    formData.criteria.firstClass === "TIEN_ICH"
  ) {
    // Validate tiêu đề:
    if (!formData.title.trim()) {
      message.error("Tiêu đề không được để trống");
      return;
    }
    if (
      formData.title.trim().length < 10 ||
      formData.title.trim().length > 50
    ) {
      message.error("Tiêu đề phải từ 10 đến 100 ký tự");
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
    if (!formData.criteria.openHours) {
      message.error("Giờ mở cửa không được để trống");
      return;
    }

    if (!formData.criteria.idDistrict) {
      message.error("Khu vực không được để trống");
      return;
    }
    if (!formData.criteria.address.trim()) {
      message.error("Địa chỉ không được để trống");
      return;
    }
    if (isImagesRequired.value) {
      if (
        !files.value[0] ||
        !files.value[1] ||
        !files.value[2] ||
        !files.value[3]
      ) {
        message.error("Bạn phải tải lên đủ 4 ảnh theo yêu cầu");
        return;
      }
    }
  }

  // Hiển thị confirm trước khi đăng
  confirm({
    title: "Xác nhận đăng bài",
    content: "Bạn có chắc chắn muốn đăng bài viết này không? (Phí: 2000₫/lần)",
    async onOk() {
      loading.value = true;
      try {
        // Thêm inventory data vào formData trước khi gửi
        const productData = {
          ...formData,
          inventory: inventoryData.value,
        };

        const { data: product } = await createProduct(productData);
        const productId = product.id;

        // Upload multiple images if exist
        const imagesToUpload = uploadedImages.value.map((img) => img.file);

        if (imagesToUpload.length > 0) {
          await uploadMultipleImages(productId, imagesToUpload);
        }

        // Upload documents if any
        if (selectedDocuments.value.length > 0) {
          for (const doc of selectedDocuments.value) {
            await uploadDocument(productId, doc);
          }
        }

        message.success("Đăng tin thành công!");
        resetForm();
        // Reset uploadedImages array
        uploadedImages.value.forEach((img) => {
          URL.revokeObjectURL(img.preview);
        });
        uploadedImages.value = [];
      } catch (error) {
        const errorMessage = error.message;
        if (errorMessage.includes("Số dư không đủ")) {
          message.error(
            "Không thể đăng bài: Số dư không đủ 2000 đồng. Vui lòng nạp thêm tiền để có thể Đăng tin!"
          );
        } else {
          message.error("Đã có lỗi xảy ra");
        }
      } finally {
        loading.value = false;
      }
    },
    onCancel() {
      message.info("Đã hủy đăng tin");
    },
  });
};

const toggleFeature = (featureValue) => {
  formData.criteria[featureValue] = !formData.criteria[featureValue];
};

// Xử lý inventory validation
const handleInventoryValidation = (isValid) => {
  isInventoryValid.value = isValid;
};

const resetForm = () => {
  Object.assign(formData, {
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
    },
  });
  // Reset uploadedImages khi reset form
  uploadedImages.value.forEach((img) => {
    URL.revokeObjectURL(img.preview);
  });
  uploadedImages.value = [];

  // Reset inventory data
  inventoryData.value = {};
};
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
