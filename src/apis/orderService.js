import axios from "@/axios";

// Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async (params) => {
    return axios({
        url: "/api/admin/orders",
        method: "GET",
        params: params,
    });
};

// Lấy chi tiết đơn hàng theo ID (Admin)
export const getOrderById = async (id) => {
    return axios({
        url: `/api/admin/order/${id}`,
        method: "GET",
    });
};

// Hủy đơn hàng (Admin)
export const cancelOrder = async (id) => {
    return axios({
        url: `/api/admin/order/${id}/cancel`,
        method: "PATCH",
    });
};

// Lấy thông tin thanh toán của đơn hàng
export const getPaymentByOrderCode = async (orderCode) => {
    return axios({
        url: `/api/payment/order/${orderCode}/status`,
        method: "GET",
    });
};

// Lấy chi tiết thanh toán từ payment result
export const getOrderFromPaymentResult = async (id) => {
    return axios({
        url: `/api/payment/result/${id}/order`,
        method: "GET",
    });
};