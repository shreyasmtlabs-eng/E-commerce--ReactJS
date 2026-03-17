import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-4xl p-8 rounded shadow ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Add New Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className={`border p-2 rounded transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className={`border p-2 rounded transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className={`border p-2 rounded transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className={`border p-2 rounded transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            required
          />

          <input
            name="rating"
            type="number"
            step="0.1"
            max="5"
            placeholder="Rating (0-5)"
            value={form.rating}
            onChange={handleChange}
            className={`border p-2 rounded transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className={`border p-2 rounded w-full mt-4 h-28 transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          required
        />

        <button
          type="submit"
          disabled={addMutation.isPending}
          className={`w-full py-3 rounded mt-6 transition-all ${
            darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800"
              : "bg-black text-white hover:bg-gray-900 disabled:bg-gray-400"
          } disabled:opacity-50`}
        >
          {addMutation.isPending ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
