<template>
  <div class="flex flex-col h-full">
    <!-- Logo -->
    <div class="flex items-center justify-center h-28 mt-4 mb-6">
      <div class="logo-text-footer">
        <div class="tuan-footer">TUAN</div>
        <div class="fashion-footer">Fashion</div>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <a-menu
      mode="inline"
      theme="light"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
    >
      <!-- Các mục không có children -->
      <a-menu-item v-for="item in menuItemsWithoutChildren" :key="item.path">
        <router-link :to="item.path" class="flex items-center gap-3">
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
        </router-link>
      </a-menu-item>

      
    </a-menu>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Wallet, Users, FileText, ChartPie, Activity, Package, PackagePlus } from "lucide-vue-next";

const menuItems = [
  { label: "Tổng quan", path: "/home/dashboard", icon: ChartPie },
  { label: "Hoạt động", path: "/home/action", icon: Activity },
  { label: "Người dùng", path: "/home/user", icon: Users },
  { label: "Nạp tiền", path: "/home/payment", icon: Wallet },
  { label: "Đăng sản phẩm", path: "/home/create-product", icon: PackagePlus},
  { label: "Quản lý sản phẩm", path: "/home/product", icon: Package },
];

// Lọc menuItems thành 2 nhóm
const menuItemsWithoutChildren = computed(() =>
  menuItems.filter((item) => !item.children)
);
const menuItemsWithChildren = computed(() =>
  menuItems.filter((item) => item.children)
);

// Điều khiển trạng thái mở rộng của sidebar
const selectedKeys = ref(["dashboard"]);
const openKeys = ref(["product"]);
</script>

<style scoped>
.logo-text-footer {
  font-family: "Open Sans", sans-serif;
  line-height: 1;
  text-align: center;
}

.tuan-footer {
  font-size: 2.5em;
  font-weight: 900;
  letter-spacing: 1px;
  color: #000000; /* Chữ đen */
}

.fashion-footer {
  font-size: 1.6em;
  font-weight: 600;
  letter-spacing: 1px;
  color: #000000; /* Chữ đen */
}
</style>
