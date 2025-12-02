import Home from "../pages/home/Home.vue";
import NotFound from "../pages/not-found/NotFound.vue";
import User from "../pages/user/UserManagement.vue";
import Dashboard from "../pages/dashboard/Dashboard.vue";
import Action from "../pages/action/Action.vue";

// Import các loại bài đăng

import PaymentManagement from "../pages/payment/PaymentManagement.vue";
import CreateProduct from "../pages/create-product/CreateProduct.vue";
import UpdateProduct from "../pages/update-product/UpdateProduct.vue";
import ProductManagement from "../pages/product/ProductManagement.vue";
import ProductDetail from "../pages/product/ProductDetail.vue";
import OrderManagement from "../pages/order/OrderManagement.vue";


export default [
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: "payment",
        name: "PaymentManagement",
        component: PaymentManagement,
        meta: { requiresAuth: false },
      },
      {
        path: "order",
        name: "OrderManagement",
        component: OrderManagement,
        meta: { requiresAuth: false },
      },
      {
        path: "user",
        name: "User",
        component: User,
        meta: { requiresAuth: false },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: false },
      },
      {
        path: "action",
        name: "Action",
        component: Action,
        meta: { requiresAuth: false },
      },

      {
        path: "create-product",
        name: "CreateProduct",
        component: CreateProduct,
        meta: { requiresAuth: false },
      },
      {
        path: "product",
        name: "ProductManagement",
        component: ProductManagement,
        meta: { requiresAuth: false },
      },
      {
        path: "product/:id",
        name: "ProductDetail",
        component: ProductDetail,
        meta: { requiresAuth: false },
      },


      {
        path: "update-product/:id",
        name: "UpdateProduct",
        component: UpdateProduct,
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: "/not-found",
    name: "NotFound",
    component: NotFound,
    meta: { requiresAuth: false },
  },
];
