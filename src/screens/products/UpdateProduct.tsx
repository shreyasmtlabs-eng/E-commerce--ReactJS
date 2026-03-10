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

export default function UpdateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProductsApi,
  });

  const updateMutation = useMutation({
    mutationFn: (product: Product) =>
      api.put(`/products/${product.id}`, product),

    onSuccess: (_, variables) => {
      const stored = JSON.parse(localStorage.getItem("customProducts") || "[]");

      const updated = stored.map((p: any) =>
        p.id === variables.id ? variables : p,
      );

      localStorage.setItem("customProducts", JSON.stringify(updated));

      queryClient.setQueryData(["products"], (old: any[]) =>
        old.map((p) => (p.id === variables.id ? variables : p)),
      );

      alert("Product Updated Successfully");
      navigate("/home");
    },
    onError: () => {
      alert("Failed to update product");
    },
  });

  const handleEditClick = (product: Product) => {
    setEditProduct({ ...product });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!editProduct) return;

    setEditProduct({
      ...editProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    if (!editProduct) return;
    updateMutation.mutate({
      ...editProduct,
      price: Number(editProduct.price),
    });
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading Products...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg flex flex-col"
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
              onClick={() => handleEditClick(p)}
              className="mt-3 w-full bg-black text-white py-1 rounded hover:bg-gray-900"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4 text-center">Edit Product</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={editProduct.title}
                onChange={handleChange}
                placeholder="Title"
                className="border p-2 rounded"
              />

              <input
                name="price"
                value={editProduct.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                className="border p-2 rounded"
              />

              <input
                name="image"
                value={editProduct.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="border p-2 rounded"
              />

              <input
                name="category"
                value={editProduct.category}
                onChange={handleChange}
                placeholder="Category"
                className="border p-2 rounded"
              />
            </div>

            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded w-full mt-4 h-28"
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </button>

              <button
                onClick={() => setEditProduct(null)}
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
