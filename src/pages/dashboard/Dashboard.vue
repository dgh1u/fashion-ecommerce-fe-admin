<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <!-- Welcome Section -->
        <div class=" lg:mb-0">
          <div class="flex items-center space-x-3 ">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <IconUsers class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Chào mừng, {{ fullName }}
              </h1>
              <p class="text-gray-500 text-sm font-medium">Tổng quan hệ thống </p>
            </div>
          </div>
    
        </div>

        <!-- Control Panel -->
        <div class="flex flex-wrap gap-3">
          <div class="relative">
            <select
              v-model="selectedYear"
              @change="fetchRevenueAndBuildData"
              class="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option v-for="y in availableYears" :key="y" :value="y">
                Năm {{ y }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <div class="relative">
            <select
              v-model="groupMode"
              @change="fetchRevenueAndBuildData"
              class="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="year">Theo năm</option>
              <option value="month">Theo tháng</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <div v-if="groupMode === 'month'" class="relative">
            <select
              v-model="selectedMonth"
              @change="fetchRevenueAndBuildData"
              class="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option
                v-for="m in availableMonths"
                :key="m.value"
                :value="m.value"
              >
                {{ m.label }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <!-- Users Card -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <IconUsers class="w-6 h-6 text-white" />
          </div>
          <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Người dùng</h3>
          <p class="text-2xl font-bold text-gray-900">{{ summary?.totalUsers || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Tổng số tài khoản</p>
        </div>
      </div>

      <!-- Payments Card -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <IconBanknote class="w-6 h-6 text-white" />
          </div>
          <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Giao dịch</h3>
          <p class="text-2xl font-bold text-gray-900">{{ summary?.totalPayments || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Số lượng thanh toán</p>
        </div>
      </div>

      <!-- Products Card -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Package class="w-6 h-6 text-white" />
          </div>
          <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Sản phẩm</h3>
          <p class="text-2xl font-bold text-gray-900">{{ summary?.totalProducts || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Tổng số sản phẩm</p>
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <IconDollarSign class="w-6 h-6 text-white" />
          </div>
          <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Doanh thu</h3>
          <p class="text-2xl font-bold text-gray-900">{{ formattedTotalRevenue }}₫</p>
          <p class="text-xs text-gray-500 mt-1">Tổng thu nhập</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Biểu đồ Doanh Thu</h3>
            <p class="text-sm text-gray-500 mt-1">Thống kê doanh thu theo thời gian</p>
          </div>
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <div class="relative">
          <LineChart
            :chart-data="revenueChartData"
            :chart-options="revenueChartOptions"
            class="h-80"
          />
        </div>
      </div>

      <!-- Transaction Chart -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Biểu đồ Giao Dịch</h3>
            <p class="text-sm text-gray-500 mt-1">Số lượng giao dịch theo thời gian</p>
          </div>
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="relative">
          <BarChart
            :chart-data="transactionChartData"
            :chart-options="transactionChartOptions"
            class="h-80"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "@/axios";

// Lucide Icons
import {
  Users as IconUsers,
  Banknote as IconBanknote,
  FileText as IconFileText,
  DollarSign as IconDollarSign,
  Package,
} from "lucide-vue-next";

// Chart.js + vue-chart-3
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { LineChart, BarChart } from "vue-chart-3";
import { getListProduct } from "@/apis/productService";
import { useAuthStore } from "@/stores/store";

const pendingProductCount = ref(0);
const authStore = useAuthStore();
const fullName = computed(() => authStore.user?.fullName || "Người dùng");

// API Data
const summary = ref(null); // /api/dashboard/summary
const revenueData = ref([]); // /api/dashboard/revenue

// Group mode: 'year' or 'month'
const groupMode = ref("year");
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(1);

// Available years, months
const availableYears = ref([2023, 2024, 2025]);
const availableMonths = ref([
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
]);

async function fetchPendingProducts() {
  try {
    // Lấy tất cả sản phẩm đang hiển thị
    const res = await getListProduct({ del: false });

    // Giả sử API trả về danh sách bài viết trong res.data
    pendingProductCount.value = res.data?.total || 0;
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
  }
}

// Computed property để format tổng doanh thu theo kiểu xx.xxx.xxx
const formattedTotalRevenue = computed(() => {
  console.log("Giá trị summary:", summary.value);
  if (summary.value && summary.value.totalRevenue != null) {
    const formatted = new Intl.NumberFormat("vi-VN").format(
      summary.value.totalRevenue
    );
    console.log("Giá trị formattedTotalRevenue:", formatted);
    return formatted;
  }
  return "";
});

// Biểu đồ Doanh Thu
const revenueChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Doanh thu",
      data: [],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      tension: 0.4,
    },
  ],
});
const revenueChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Biểu đồ Số Giao Dịch
const transactionChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Số Giao Dịch",
      data: [],
      backgroundColor: "rgba(135, 206, 250, 1)",
      borderWidth: 1,
      borderRadius: 8,
    },
  ],
});
const transactionChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Lifecycle
onMounted(async () => {
  await fetchSummary();
  await fetchRevenueAndBuildData();
  await fetchPendingProducts();
});

// Watch thay đổi
watch([groupMode, selectedYear, selectedMonth], async () => {
  await fetchRevenueAndBuildData();
});

// Gọi API summary
async function fetchSummary() {
  try {
    const res = await axios.get("/api/dashboard/summary");
    summary.value = res;
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

// Gọi API revenue
async function fetchRevenue() {
  let start = "",
    end = "",
    groupBy = "";
  if (groupMode.value === "year") {
    start = `${selectedYear.value}-01-01`;
    end = `${selectedYear.value}-12-31`;
    groupBy = "month";
  } else {
    // groupMode = "month"
    const lastDay = new Date(
      selectedYear.value,
      selectedMonth.value,
      0
    ).getDate();
    const monthStr =
      selectedMonth.value < 10
        ? "0" + selectedMonth.value
        : selectedMonth.value;
    start = `${selectedYear.value}-${monthStr}-01`;
    end = `${selectedYear.value}-${monthStr}-${lastDay}`;
    groupBy = "day";
  }
  try {
    const res = await axios.get("/api/dashboard/revenue", {
      params: { start, end, groupBy },
    });
    revenueData.value = res;
  } catch (error) {
    console.error("Error fetching revenue:", error);
  }
}

// Build chart data
async function fetchRevenueAndBuildData() {
  await fetchRevenue();
  buildChartData();
}

function buildChartData() {
  // Tạo expectedLabels
  let expectedLabels = [];
  if (groupMode.value === "year") {
    for (let i = 1; i <= 12; i++) {
      expectedLabels.push(i < 10 ? "0" + i : "" + i);
    }
  } else {
    // groupMode = "month"
    const lastDay = new Date(
      selectedYear.value,
      selectedMonth.value,
      0
    ).getDate();
    for (let i = 1; i <= lastDay; i++) {
      expectedLabels.push(i < 10 ? "0" + i : "" + i);
    }
  }

  // Tạo map các giá trị doanh thu và giao dịch dựa trên key
  let revenueMap = {};
  let transactionMap = {};
  revenueData.value.forEach((item) => {
    const rawKey = item.groupKey;
    let parsedKey = "";
    if (groupMode.value === "year") {
      // "2025-06" => "06"
      parsedKey = rawKey.split("-")[1];
    } else {
      // "2025-06-15" => "15"
      parsedKey = rawKey.split("-")[2];
    }
    revenueMap[parsedKey] = item.totalRevenue;
    transactionMap[parsedKey] = item.transactionCount;
  });

  const revenueSeries = expectedLabels.map((label) =>
    revenueMap[label] !== undefined ? revenueMap[label] : 0
  );
  const transactionSeries = expectedLabels.map((label) =>
    transactionMap[label] !== undefined ? transactionMap[label] : 0
  );

  // Cập nhật dữ liệu cho biểu đồ
  revenueChartData.value.labels = expectedLabels;
  revenueChartData.value.datasets[0].data = revenueSeries;

  transactionChartData.value.labels = expectedLabels;
  transactionChartData.value.datasets[0].data = transactionSeries;
}
</script>

<style scoped>
/* Ví dụ tùy biến Tailwind nếu cần:
.bg-white { background-color: #fff; }
.shadow { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.rounded-xl { border-radius: 0.5rem; }
*/
</style>
