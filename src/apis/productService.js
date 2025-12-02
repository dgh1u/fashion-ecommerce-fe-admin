import axios from "@/axios";

// Lấy tất cả bài viết
export const getListProduct = async (params) => {
  return axios({
    url: "/api/products",
    method: "GET",
    params: params,
  });
};

// Lấy chi tiết 1 bài viết
export const getDetailProduct = async (id) => {
  return axios({
    url: `api/product/${id}`,
    method: "GET",
  });
};

// Lấy chi tiết sản phẩm theo ID (alias cho UpdateProduct)
export const getProductById = async (id) => {
  return axios({
    url: `api/product/${id}`,
    method: "GET",
  });
};

// Lấy danh sách tin đăng của một người dùng theo userId
export const getProductsByUserId = async (idUser, params) => {
  return axios({
    url: `/api/products/${idUser}`,
    method: "GET",
    params: params,
  });
};

// Tạo bài đăng mới
export const createProduct = async (data) => {
  return axios({
    url: `/api/product`,
    method: "POST",
    data,
  });
};

// Cập nhật bài đăng
export const updateProduct = async (id, data) => {
  return axios({
    url: `/api/product/${id}`,
    method: "PUT",
    data,
  });
};

// Ẩn/Hiển thị sản phẩm (Toggle visibility)
export const hideProduct = async (id) => {
  return axios({
    url: `/api/product/hide/${id}`,
    method: "PUT",
  });
};

// Xóa bài đăng (Admin only)
export const deleteProduct = async (id) => {
  return axios({
    url: `/api/product/${id}`,
    method: "DELETE",
  });
};
