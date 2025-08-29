import Home from "../pages/home/Home.vue";
import NotFound from "../pages/not-found/NotFound.vue";
import User from "../pages/user/UserManagement.vue";
import Dashboard from "../pages/dashboard/Dashboard.vue";
import Action from "../pages/action/Action.vue";

// Import các loại bài đăng

import PaymentManagement from "../pages/payment/PaymentManagement.vue";
import CreateProduct from "../pages/create-product/CreateProduct.vue";
import DocumentManagement from "../pages/product/document/DocumentManagement.vue";


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
        path: "product/document",
        name: "DocumentPost",
        component: DocumentManagement,
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
