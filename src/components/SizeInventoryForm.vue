<template>
  <div class="size-inventory-form">
    <div class="py-2 mb-4">
      <span class="font-bold text-base">Quản lý Size và Số lượng</span>
      <p class="text-sm text-gray-600 mt-1">
        Nhập số lượng tồn kho cho từng size. Để 0 nếu size đó không có sẵn.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="size in sizes"
        :key="size.id"
        class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
      >
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-gray-700">
            Size {{ size.name }}
          </label>
          <span class="text-xs text-gray-500">{{
            getSizeDescription(size.name)
          }}</span>
        </div>

        <div class="relative">
          <input
            v-model.number="inventoryData[size.id]"
            type="number"
            min="0"
            max="9999"
            :placeholder="`Số lượng size ${size.name}`"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            @input="validateQuantity(size.id)"
          />
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
          >
            cái
          </div>
        </div>

        <!-- Hiển thị lỗi nếu có -->
        <div v-if="errors[size.id]" class="text-red-500 text-xs mt-1">
          {{ errors[size.id] }}
        </div>
      </div>
    </div>

    <!-- Tóm tắt -->
    <div class="mt-6 bg-gray-50 p-4 rounded-lg">
      <h4 class="font-medium text-gray-700 mb-2">Tóm tắt tồn kho:</h4>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">Tổng số lượng:</span>
          <span class="font-medium ml-2">{{ totalQuantity }} cái</span>
        </div>
        <div>
          <span class="text-gray-600">Số size có hàng:</span>
          <span class="font-medium ml-2">{{ availableSizes }} sizes</span>
        </div>
        <div>
          <span class="text-gray-600">Trạng thái:</span>
          <span
            class="font-medium ml-2"
            :class="totalQuantity > 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ totalQuantity > 0 ? "Có hàng" : "Hết hàng" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Lưu ý -->
    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg
            class="w-5 h-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h4 class="text-sm font-medium text-blue-800">Lưu ý quan trọng:</h4>
          <ul
            class="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1"
          >
            <li>Phải có ít nhất 1 size với số lượng > 0</li>
            <li>Số lượng tối đa cho mỗi size là 9999</li>
            <li>Có thể cập nhật số lượng sau khi tạo sản phẩm</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { getAllSizes } from "@/apis/sizeService.js";
import { message } from "ant-design-vue";

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "validate"]);

// Reactive data
const sizes = ref([]);
const inventoryData = ref({});
const errors = ref({});
const loading = ref(false);

// Computed
const totalQuantity = computed(() => {
  return Object.values(inventoryData.value).reduce((sum, qty) => {
    return sum + (Number(qty) || 0);
  }, 0);
});

const availableSizes = computed(() => {
  return Object.values(inventoryData.value).filter((qty) => Number(qty) > 0)
    .length;
});

const isValid = computed(() => {
  return totalQuantity.value > 0 && Object.keys(errors.value).length === 0;
});

// Methods
const loadSizes = async () => {
  try {
    loading.value = true;
    const response = await getAllSizes();

    if (response.success) {
      sizes.value = response.data;
      // Khởi tạo inventoryData với giá trị 0 cho tất cả sizes
      const initialData = {};
      sizes.value.forEach((size) => {
        initialData[size.id] = props.modelValue[size.id] || 0;
      });
      inventoryData.value = initialData;
    } else {
      message.error("Không thể tải danh sách size");
    }
  } catch (error) {
    console.error("Error loading sizes:", error);
    message.error("Lỗi khi tải danh sách size");
  } finally {
    loading.value = false;
  }
};

const validateQuantity = (sizeId) => {
  const quantity = inventoryData.value[sizeId];

  // Clear previous error
  delete errors.value[sizeId];

  if (quantity < 0) {
    errors.value[sizeId] = "Số lượng không được âm";
  } else if (quantity > 9999) {
    errors.value[sizeId] = "Số lượng tối đa là 9999";
  }

  // Emit validation status
  emit("validate", isValid.value);
};

const getSizeDescription = (sizeName) => {
  const descriptions = {
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    "2XL": "2X Large",
    "3XL": "3X Large",
  };
  return descriptions[sizeName] || sizeName;
};

// Watch inventoryData changes và emit lên parent
watch(
  inventoryData,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// Watch props changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      // Chỉ cập nhật nếu khác với giá trị hiện tại để tránh infinite loop
      const currentKeys = Object.keys(inventoryData.value);
      const newKeys = Object.keys(newValue);

      let needUpdate = currentKeys.length !== newKeys.length;
      if (!needUpdate) {
        needUpdate = newKeys.some(
          (key) => inventoryData.value[key] !== newValue[key]
        );
      }

      if (needUpdate) {
        inventoryData.value = { ...newValue };
      }
    }
  },
  { immediate: false }
); // Tắt immediate để tránh conflict với onMounted

// Lifecycle
onMounted(() => {
  loadSizes();
});
</script>

<style scoped>
/* Custom styles nếu cần */
</style>
