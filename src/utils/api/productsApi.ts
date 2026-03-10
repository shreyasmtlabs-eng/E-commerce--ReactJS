import { api } from "../api/api";

export const getProductsApi = async () => {
  const res = await api.get("/products");
  const customProducts = JSON.parse(
    localStorage.getItem("customProducts") || "[]"
  );

  return [...customProducts, ...res.data];
};

export const addProductApi = async (product: any) => {
  const res = await api.post("/products", product);
  return res.data;
};

export const updateProductApi = async (product: any) => {
  const res = await api.put(`/products/${product.id}`, product);
  return res.data;
};

export const deleteProductApi = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};