<template>
  <div class="image-sorter">
    <!-- Display uploaded images with drag and drop functionality -->
    <div v-if="images.length > 0" class="grid grid-cols-2 gap-4">
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        :draggable="true"
        @dragstart="handleDragStart(index)"
        @dragend="handleDragEnd"
        @dragover.prevent
        @drop="handleDrop(index)"
        class="relative h-32 rounded-lg overflow-hidden border cursor-move transition-transform hover:scale-105"
        :class="{ 'opacity-50': draggedIndex === index }"
      >
        <!-- Order indicator -->
        <div class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
          {{ index + 1 }}
        </div>
        
        <!-- Image preview -->
        <img
          :src="image.preview || `data:image/jpeg;base64,${image.uri}`"
          :alt="image.fileName || 'preview'"
          class="w-full h-full object-cover"
        />
        
        <!-- Remove button -->
        <button
          @click="handleRemove(index)"
          class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-90 rounded-md text-red-500 hover:text-red-600 text-xs z-10"
        >
          <Trash2 class="w-3 h-3" />
          <span>Xóa</span>
        </button>
        
        <!-- Move buttons -->
        <div class="absolute top-1 right-1 flex flex-col gap-1">
          <button
            v-if="index > 0"
            @click="moveImage(index, index - 1)"
            class="bg-white bg-opacity-90 rounded p-1 text-gray-600 hover:text-gray-800 text-xs"
            title="Di chuyển lên"
          >
            <ChevronUp class="w-3 h-3" />
          </button>
          <button
            v-if="index < images.length - 1"
            @click="moveImage(index, index + 1)"
            class="bg-white bg-opacity-90 rounded p-1 text-gray-600 hover:text-gray-800 text-xs"
            title="Di chuyển xuống"
          >
            <ChevronDown class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div v-if="images.length > 1" class="mt-4 text-sm text-gray-600 text-center">
      💡 Kéo thả để sắp xếp thứ tự ảnh hoặc sử dụng các nút ↑↓
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:images', 'remove-image', 'order-changed'])

const draggedIndex = ref(null)

const handleDragStart = (index) => {
  draggedIndex.value = index
}

const handleDragEnd = () => {
  draggedIndex.value = null
}

const handleDrop = (dropIndex) => {
  if (draggedIndex.value !== null && draggedIndex.value !== dropIndex) {
    moveImage(draggedIndex.value, dropIndex)
  }
  draggedIndex.value = null
}

const moveImage = (fromIndex, toIndex) => {
  const updatedImages = [...props.images]
  const [movedImage] = updatedImages.splice(fromIndex, 1)
  updatedImages.splice(toIndex, 0, movedImage)
  
  emit('update:images', updatedImages)
  emit('order-changed', updatedImages)
}

const handleRemove = (index) => {
  emit('remove-image', index)
}
</script>

<style scoped>
.image-sorter .cursor-move:hover {
  transform: scale(1.02);
}

.image-sorter .opacity-50 {
  opacity: 0.5;
}
</style>