import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rating: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMutation = useMutation({
    mutationFn: (newProduct: any) => api.post("/products", newProduct),

    onSuccess: (res) => {
      const newProduct = {
        ...res.data,
        id: Date.now(),
      };

      const existing = JSON.parse(
        localStorage.getItem("customProducts") || "[]",
      );

      const updated = [...existing, newProduct];

      localStorage.setItem("customProducts", JSON.stringify(updated));

      queryClient.setQueryData(["products"], (old: any = []) => {
        return [...old, newProduct];
      });

      navigate("/home", {
        state: { message: "Product Added Successfully" },
      });
    },

    onError: () => {
      alert("Failed to Add Product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addMutation.mutate({
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Product Title"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4 h-28"
          required
        />

        <button
          disabled={addMutation.isPending}
          className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-900 disabled:opacity-50"
        >
          {addMutation.isPending ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
