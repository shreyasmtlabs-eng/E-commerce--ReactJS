import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "../../utils/api/productsApi";
import { api } from "../../utils/api/api";

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
    return <p className="text-center mt-10">Loading Products...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Delete Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-3 rounded shadow hover:shadow-lg flex flex-col"
          >
            <div className="h-[180px] flex items-center justify-center">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-[180px] object-contain"
              />
            </div>

            <h3 className="text-sm font-semibold mt-2 line-clamp-2 min-h-[40px]">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>

            <p className="text-gray-600 mb-6">
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
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
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
