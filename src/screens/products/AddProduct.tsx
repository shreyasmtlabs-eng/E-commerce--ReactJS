import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  Package,
  Sparkles,
  Image,
  Tag,
  DollarSign,
  Star,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { colors } from "../../assets/constants/color";

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const categories = [
    "Select a category",
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
    "footwear",
    "watches",
    "bags",
    "beauty",
    "eyewear",
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-8 px-4 transition-colors duration-200 ${
        darkMode
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA]"
      }`}
    >
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:translate-x-[-2px]"
          style={{
            backgroundColor: darkMode ? "rgba(55, 65, 81, 0.8)" : "white",
            color: darkMode ? colors.primary : colors.secondary,
            boxShadow: darkMode ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white"
          }`}
          style={
            !darkMode
              ? { boxShadow: "0 20px 35px -10px rgba(173, 156, 142, 0.2)" }
              : {}
          }
        >
          {/* Header */}
          <div
            className="px-8 py-6 border-b"
            style={{ borderColor: darkMode ? "#374151" : colors.accent + "40" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Add New Product
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Fill in the details to add a new product to your store
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product Title */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Product Title
                  </span>
                </label>
                <input
                  name="title"
                  placeholder="Enter product title"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <DollarSign
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Price
                  </span>
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Star
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Rating (0-5)
                  </span>
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  value={form.rating}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Tag
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Category
                  </span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 focus:ring-[#AD9C8E]"
                  }`}
                  required
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat === "Select a category" ? "" : cat}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Image
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Image URL
                  </span>
                </label>
                <input
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Product Description
                  </span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your product in detail..."
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Preview Section (if image URL is provided) */}
            {form.image && (
              <div
                className="mt-6 pt-6 border-t"
                style={{
                  borderColor: darkMode ? "#374151" : colors.accent + "40",
                }}
              >
                <h3
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <Image
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  Image Preview
                </h3>
                <div className="flex justify-center">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-40 h-40 object-contain rounded-xl bg-gray-50 dark:bg-gray-700 p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=Invalid+URL";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={addMutation.isPending}
              className={`w-full py-3 rounded-xl mt-8 font-semibold transition-all duration-200 ${
                addMutation.isPending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-lg"
              } text-white`}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              {addMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Add Product
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
