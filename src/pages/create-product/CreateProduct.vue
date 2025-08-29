<template>

    <div class="create-product max-w-3xl mx-auto space-y-4">
      <div class="block items-center pb-4 justify-center flex">
        <span class="font-bold text-3xl text-black">Đăng tải sản phẩm</span>
      </div>
      <div class="block bg-white p-4 pb-6 rounded-xl">
        <div class="py-2">
          <span class="font-bold text-base">Phân loại</span>
        </div>

        <!-- Selection phụ cho QUAN_AN -->
        <div v-if="formData.criteria.firstClass === 'QUAN_AO'" >
          <label>Loại tài liệu <span class="text-red-500">*</span> </label>
          <div class="flex rounded-lg mt-1">
            <a-select
              v-model:value="formData.criteria.secondClass"
              placeholder="Chọn loại tài liệu"
              class="w-full"
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
              <a-select-option value="Tài liệu khác"
                >Tài liệu khác</a-select-option
              >
            </a-select>
          </div>
        </div>
        <!-- Selection phụ cho QUAN_AN -->
        <div v-if="formData.criteria.firstClass === 'QUAN_AO'" class="mt-3">
          <label>Chuyên ngành <span class="text-red-500">*</span> </label>
          <div class="flex rounded-lg mt-1">
            <a-select
              v-model:value="formData.criteria.major"
              placeholder="Chọn chuyên ngành"
              class="w-full"
            >
              <a-select-option value="Thú y">Thú y</a-select-option>
              <a-select-option value="Chăn nuôi - Thủy sản"
                >Chăn nuôi - Thủy sản</a-select-option
              >
              <a-select-option value="Cơ điện">Cơ điện</a-select-option>
              <a-select-option value="Công nghệ thông tin"
                >Công nghệ thông tin</a-select-option
              >
              <a-select-option value="Kinh tế">Kinh tế</a-select-option>
              <a-select-option value="Công nghệ sinh học"
                >Công nghệ sinh học</a-select-option
              >
              <a-select-option value="Công nghệ thực phẩm"
                >Công nghệ thực phẩm</a-select-option
              >
              <a-select-option value="Nông học">Nông học</a-select-option>
              <a-select-option value="Khoa học môi trường"
                >Khoa học môi trường</a-select-option
              >
              <a-select-option value="Xã hội học">Xã hội học</a-select-option>
              <a-select-option value="Ngôn ngữ">Ngôn ngữ</a-select-option>
              <a-select-option value="Du lịch">Du lịch</a-select-option>
              <a-select-option value="Sư phạm">Sư phạm</a-select-option>
              <a-select-option value="Quản lý đất đai"
                >Quản lý đất đai</a-select-option
              >
              <a-select-option value="Sư phạm">Sư phạm</a-select-option>
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

        <div
       
          class="py-2"
        >
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

        <div
          v-if="
            formData.criteria.firstClass === 'PHONG_TRO' ||
            formData.criteria.firstClass === 'O_GHEP'
          "
          class="py-2"
        >
          <label class="block text-gray-700"
            >Diện tích <span class="text-red-500">*</span></label
          >
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.criteria.acreage"
              type="number"
              placeholder="Nhập diện tích"
              class="w-full p-2 border-none outline-none rounded-lg"
            />
            <span class="p-2 border-l border-gray-300">m²</span>
          </div>
        </div>

        <div
        
          class="py-2"
        >
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

        <div
          v-if="
            formData.criteria.firstClass === 'PHONG_TRO' ||
            formData.criteria.firstClass === 'O_GHEP'
          "
          class="py-2"
        >
          <label class="block text-gray-700"
            >Giá nước <span class="text-red-500">*</span></label
          >
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.criteria.waterPrice"
              type="number"
              placeholder="VD: 30000"
              class="w-full p-2 border-none outline-none rounded-lg"
            />
            <span class="p-2 border-l border-gray-300">đồng/m³</span>
          </div>
        </div>

        <div
          v-if="
            formData.criteria.firstClass === 'QUAN_AN' ||
            formData.criteria.firstClass === 'QUAN_NUOC' ||
            formData.criteria.firstClass === 'CUA_HANG' ||
            formData.criteria.firstClass === 'TIEN_ICH'
          "
          class="py-2"
        >
          <label class="block text-gray-700"
            >Giờ mở cửa <span class="text-red-500">*</span></label
          >
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-36"
          >
            <a-time-range-picker
              v-model.number="formData.criteria.openHours"
              type="number"
              format="HH:mm"
              placeholder="Nhập giờ mở cửa"
              class="w-full border-none outline-none rounded-lg"
              @change="handleTimeChange"
            />
          </div>
        </div>

        <div
          v-if="
            formData.criteria.firstClass === 'QUAN_AN' ||
            formData.criteria.firstClass === 'QUAN_NUOC'
          "
          class="py-2"
        >
          <label class="block text-gray-700"
            >Link ShopeeFood <span class="text-red-500">*</span></label
          >
          <div class="flex items-center border border-gray-300 rounded-lg mt-1">
            <input
              v-model.number="formData.criteria.linkShopeeFood"
              type="text"
              placeholder="Nhập link ShopeeFood (nếu có)"
              class="w-full p-2 border-none outline-none rounded-lg"
            />
          </div>
        </div>
      </div>

      <div
        v-if="
          formData.criteria.firstClass === 'PHONG_TRO' ||
          formData.criteria.firstClass === 'O_GHEP' ||
          formData.criteria.firstClass === 'QUAN_AN' ||
          formData.criteria.firstClass === 'QUAN_NUOC' ||
          formData.criteria.firstClass === 'CUA_HANG' ||
          formData.criteria.firstClass === 'TIEN_ICH'
        "
        class="block bg-white p-4 rounded-xl"
      >
        <div class="py-2">
          <span class="font-bold text-base">Khu vực</span>
        </div>
        <div class="py-2">
          <label>Khu vực <span class="text-red-500">*</span></label>

          <div class="flex rounded-lg mt-1">
            <a-select
              v-model:value="formData.criteria.idDistrict"
              placeholder="Chọn khu vực"
              class="w-full"
            >
              <a-select-option
                v-for="district in districtList"
                :key="district.id"
                :value="district.id"
              >
                {{ district.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="py-2">
          <label class="block text-gray-700"
            >Địa chỉ <span class="text-red-500">*</span></label
          >
          <div class="flex items-center rounded-lg mt-1 w-120">
            <input
              v-model="formData.criteria.address"
              type="text"
              placeholder="VD: Số 12, Ngõ 34..."
              class="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div class="map-wrapper py-2">
          <label class="block text-gray-700">Bản đồ</label>
          <div class="flex items-center border border-gray-300 rounded-lg mt-1">
            <iframe
              width="100%"
              height="300"
              class="border-0"
              :src="`https://www.google.com/maps?q=${encodeURIComponent(
                displayMapAddress
              )}&output=embed`"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <div
        v-if="
          formData.criteria.firstClass === 'PHONG_TRO' ||
          formData.criteria.firstClass === 'O_GHEP'
        "
        class="block bg-white p-4 rounded-xl"
      >
        <div class="py-2">
          <span class="font-bold text-base">Đặc điểm nổi bật</span>
        </div>
        <div class="grid grid-cols-2 gap-y-3">
          <div
            v-for="(feature, idx) in featureOptionsMotel"
            :key="idx"
            class="flex items-center p-2 rounded-lg cursor-pointer hover:text-sky-500"
            :class="{ 'text-sky-500': formData.criteria[feature.value] }"
            @click="toggleFeature(feature.value)"
          >
            <div class="relative">
              <input
                type="checkbox"
                class="hidden"
                :checked="formData.criteria[feature.value]"
                readonly
              />
              <div
                class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
                :class="{
                  'bg-sky-500 border-sky-500':
                    formData.criteria[feature.value],
                }"
              >
                <CheckIcon
                  v-if="formData.criteria[feature.value]"
                  class="w-3 h-3 text-white"
                />
              </div>
            </div>
            <span class="ml-2 text-sm">{{ feature.label }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="
          formData.criteria.firstClass === 'QUAN_AN' ||
          formData.criteria.firstClass === 'QUAN_NUOC'
        "
        class="block bg-white p-4 rounded-xl"
      >
        <div class="py-2">
          <span class="font-bold text-base">Đặc điểm nổi bật</span>
        </div>
        <div class="grid grid-cols-2 gap-y-3">
          <div
            v-for="(feature, idx) in featureOptionsStore"
            :key="idx"
            class="flex items-center p-2 rounded-lg cursor-pointer hover:text-sky-500"
            :class="{ 'text-sky-500': formData.criteria[feature.value] }"
            @click="toggleFeature(feature.value)"
          >
            <div class="relative">
              <input
                type="checkbox"
                class="hidden"
                :checked="formData.criteria[feature.value]"
                readonly
              />
              <div
                class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
                :class="{
                  'bg-sky-500 border-sky-500':
                    formData.criteria[feature.value],
                }"
              >
                <CheckIcon
                  v-if="formData.criteria[feature.value]"
                  class="w-3 h-3 text-white"
                />
              </div>
            </div>
            <span class="ml-2 text-sm">{{ feature.label }}</span>
          </div>
        </div>
      </div>

      <!-- Hình ảnh -->
      <div class="block bg-white p-4 rounded-xl">
        <div class="py-2 pb-6">
          <span class="font-bold text-base">Hình ảnh</span>
        </div>

        <!-- Single Image Upload Box -->
        <div class="mb-4">
          <div v-if="!file" class="relative border-2 border-dashed border-sky-500 rounded-lg h-40 flex flex-col justify-center items-center cursor-pointer hover:bg-sky-50 transition">
            <FolderUp class="w-10 h-10 text-sky-500" />
            <span class="mt-2 text-gray-500 text-sm text-center">
              Tải ảnh từ thiết bị
            </span>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div v-else class="relative h-40 rounded-lg overflow-hidden">
            <img
              :src="file.preview"
              alt="preview"
              class="w-full h-full object-cover"
            />
            <button
              @click="removeImage"
              class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-70 rounded-md text-red-500 hover:text-red-600"
            >
              <Trash2 class="w-4 h-4" />
              <span class="text-xs">Xóa</span>
            </button>
          </div>
        </div>

        <small class="text-gray-500">
          Dung lượng ảnh tối đa 10MB
        </small>
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

import { uploadDocument } from "@/apis/documentService.js";

// Import các component của Ant Design Vue trực tiếp trong setup
const ASelect = Select;
const ASelectOptionComponent = ASelectOption;
const ASpin = Spin;

const file = ref(null);

// Thêm vào reactive data
const selectedDocuments = ref([]);

// Thêm các functions
function handleDocumentChange(event) {
  const files = Array.from(event.target.files);
  processFiles(files);
  event.target.value = "";
}

function processFiles(files) {
  const allowedTypes = [".pdf", ".docx", ".ppt", ".pptx", ".xlsx", ".zip"];
  const validFiles = files.filter((file) => {
    const fileName = file.name.toLowerCase();
    return allowedTypes.some((type) => fileName.endsWith(type));
  });

  if (validFiles.length !== files.length) {
    message.error("Chỉ cho phép upload file PDF, Word, PowerPoint");
    return;
  }

  selectedDocuments.value = [...selectedDocuments.value, ...validFiles];
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
}

function removeDocument(index) {
  selectedDocuments.value.splice(index, 1);
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Khai báo các biến reactive
const formData = reactive({
  title: "",
  content: "",
  criteria: {
    firstClass: "QUAN_AO",
    price: "",
    acreage: "",
    originalPrice: "",
    waterPrice: "",
    gender: "",
    address: "",
    idDistrict: "",
    interior: "",
    airConditioner: "",
    heater: "",
    internet: "",
    toilet: "",
    time: "",
    parking: "",
    security: "",
    owner: "",
    kitchen: "",
    secondClass: "",
    openHours: "",
    delivery: "",
    dineIn: "",
    takeAway: "",
    bigSpace: "",
    linkShopeeFood: "",
    major: "",
    referenceUrl: "",
  },
});

const districtList = ref([
  { id: 1, name: "An Đào" },
  { id: 4, name: "Đào Nguyên" },
  { id: 5, name: "Cửu Việt" },
  { id: 6, name: "Thành Chung" },
  { id: 7, name: "Ngô Xuân Quảng" },
  { id: 8, name: "Vinhomes Ocean Park" },
  { id: 9, name: "Khác" },
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

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];

  if (selectedFile) {
    if (selectedFile.size > 10 * 1024 * 1024) {
      message.error("Dung lượng ảnh không được vượt quá 10MB");
      e.target.value = null;
      return;
    }

    file.value = {
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile)
    };
  }
  e.target.value = null;
};

const removeImage = () => {
  if (file.value) {
    URL.revokeObjectURL(file.value.preview);
    file.value = null;
  }
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
  // Validate tiêu đề chỉ khi là PHONG_TRO hoặc O_GHEP
  if (
    formData.criteria.firstClass === "PHONG_TRO" ||
    formData.criteria.firstClass === "O_GHEP"
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
    if (!formData.criteria.price) {
      message.error("Giá cho thuê không được để trống");
      return;
    }
    if (!formData.criteria.acreage) {
      message.error("Diện tích không được để trống");
      return;
    }
    if (!formData.criteria.originalPrice) {
      message.error("Giá điện không được để trống");
      return;
    }
    if (!formData.criteria.waterPrice) {
      message.error("Giá nước không được để trống");
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

  // Hiển thị confirm trước khi trừ 2000 số dư
  confirm({
    title: "Xác nhận đăng bài",
    content: "Bạn có chắc chắn muốn đăng bài viết này không? (Phí: 2000₫/lần)",
    async onOk() {
      loading.value = true;
      try {
        const { data: product } = await createProduct(formData);
        const productId = product.id;

        // Upload single image if exists
        if (file.value) {
          await uploadMultipleImages(productId, [file.value.file]);
        }

        // Upload documents if any
        if (selectedDocuments.value.length > 0) {
          for (const doc of selectedDocuments.value) {
            await uploadDocument(productId, doc);
          }
        }

        message.success("Đăng tin thành công!");
        resetForm();
        file.value = null; // Reset single file
      } catch (error) {
        const errorMessage = error.message;
        if (errorMessage.includes("Số dư không đủ")) {
          message.error("Không thể đăng bài: Số dư không đủ 2000 đồng. Vui lòng nạp thêm tiền để có thể Đăng tin!");
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

const resetForm = () => {
  Object.assign(formData, {
    title: "",
    content: "",
    criteria: {
      firstClass: "QUAN_AO",
      price: "",
      acreage: "",
      originalPrice: "",
      waterPrice: "",
      gender: "",
      address: "",
      idDistrict: "",
      interior: "",
      airConditioner: "",
      heater: "",
      internet: "",
      toilet: "",
      time: "",
      parking: "",
      security: "",
      owner: "",
      kitchen: "",
      secondClass: "",
      openHours: "",
      delivery: "",
      dineIn: "",
      takeAway: "",
      bigSpace: "",
      linkShopeeFood: "",
      major: "",
      referenceUrl: "",
    },
  });
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
