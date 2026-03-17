import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "../../utils/api/productsApi";
import { api } from "../../utils/api/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export default function DeleteProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteProductItem, setDeleteProductItem] = useState<Product | null>(
    null,
  );

  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: (_, id) => {
      const stored = JSON.parse(localStorage.getItem("customProducts") || "[]");
      const updated = stored.filter((p: any) => p.id !== id);

      localStorage.setItem("customProducts", JSON.stringify(updated));

      queryClient.setQueryData(["products"], (old: any[]) =>
        old.filter((p) => p.id !== id),
      );

      alert("Product Deleted Successfully");
      navigate("/home");
    },

    onError: () => {
      alert("Failed to delete product");
    },
  });

  const handleDeleteClick = (product: Product) => {
    setDeleteProductItem(product);
  };

  const handleConfirmDelete = () => {
    if (!deleteProductItem) return;
    deleteMutation.mutate(deleteProductItem.id);
  };

  if (isLoading) {
    return;
    <div>
      <p
        //  className="text-center mt-10"
        className={`text-center mt-10 ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        Loading Products...
      </p>
      ;
    </div>;
  }

  return (
    <div
      // className="min-h-screen bg-gray-100 p-6"
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-6 transition-colors duration-200`}
    >
      <h2
        // className="text-2xl font-bold mb-6 text-center"
        className={`text-2xl font-bold mb-6 text-center ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Delete Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            // className="bg-white p-3 rounded shadow hover:shadow-lg flex flex-col"
            className={`p-3 rounded shadow hover:shadow-lg flex flex-col transition-colors ${
              darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="h-[180px] flex items-center justify-center">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-[180px] object-contain"
              />
            </div>

            <h3
              // className="text-sm font-semibold mt-2 line-clamp-2 min-h-[40px]">
              className={`text-sm font-semibold mt-2 line-clamp-2 min-h-[40px] ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {p.title}
            </h3>

            <p className="text-lg font-bold mt-1">${p.price}</p>

            <button
              onClick={() => handleDeleteClick(p)}
              className="mt-2  w-full bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {deleteProductItem && (
        // <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        //   <div className="bg-white p-6 rounded w-full max-w-md text-center">
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded w-full max-w-md text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              // className="text-xl font-bold mb-4"
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Confirm Delete
            </h3>

            <p
              // className="text-gray-600 mb-6"
              className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Are you sure you want to delete this product?
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>

              <button
                onClick={() => setDeleteProductItem(null)}
                // className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                className={`flex-1 py-2 rounded transition-colors ${
                  darkMode
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-gray-400 text-white hover:bg-gray-500"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
