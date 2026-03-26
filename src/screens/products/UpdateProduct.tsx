import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "../../utils/api/productsApi";
import { api } from "../../utils/api/api";
import { useSelector } from "react-redux";
import { colors } from "../../assets/constants/color";
import type { RootState } from "../../redux/store/store";
import {
  Edit3,
  Package,
  Search,
  ArrowLeft,
  Save,
  X,
  Image,
  Tag,
  DollarSign,
  FileText,
} from "lucide-react";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

export default function UpdateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const updateMutation = useMutation({
    mutationFn: (product: Product) =>
      api.put(`/products/${product.id}`, product),

    onSuccess: (_, variables) => {
      const stored: Product[] = JSON.parse(
        localStorage.getItem("customProducts") || "[]",
      );

      const updated = stored.map((p) =>
        p.id === variables.id ? variables : p,
      );

      localStorage.setItem("customProducts", JSON.stringify(updated));

      queryClient.setQueryData<Product[]>(["products"], (old = []) =>
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const categories = [
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

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA]"
        }`}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: colors.primary,
              borderTopColor: "transparent",
            }}
          />
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA]"
      } py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-x-0.5"
              style={{
                backgroundColor: darkMode ? "rgba(55, 65, 81, 0.8)" : "white",
                color: darkMode ? colors.primary : colors.secondary,
                boxShadow: darkMode ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Update Products
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select a product to edit its details
                </p>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              darkMode ? "bg-gray-800/50" : "bg-white"
            }`}
          >
            <Package className="w-4 h-4" style={{ color: colors.primary }} />
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {products.length} Products
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div
            className={`relative max-w-md ${
              darkMode ? "bg-gray-800/50" : "bg-white"
            } rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-2`}
            style={{ "--tw-ring-color": colors.primary } as React.CSSProperties}
          >
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 outline-none text-sm rounded-xl transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 text-white placeholder-gray-500"
                  : "bg-white text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: darkMode
                  ? colors.dark + "30"
                  : colors.primary + "20",
              }}
            >
              <Package
                className="w-12 h-12"
                style={{ color: colors.primary }}
              />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              No products found
            </h3>
            <p
              className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {searchTerm
                ? "Try a different search term"
                : "No products available to update"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col ${
                  darkMode
                    ? "bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm border border-gray-700"
                    : "bg-white hover:shadow-2xl shadow-md border border-gray-100"
                }`}
                style={!darkMode ? { borderColor: colors.accent + "40" } : {}}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl p-4 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-[160px] object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  {/* Category */}
                  <span
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: colors.accent }}
                  >
                    {p.category}
                  </span>

                  {/* Title */}
                  <h3
                    className={`text-sm font-semibold line-clamp-2 leading-relaxed mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {p.title}
                  </h3>

                  {/* Rating Preview */}
                  {p.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3 h-3"
                          fill={
                            i < Math.floor(p.rating?.rate || 0)
                              ? colors.primary
                              : "none"
                          }
                          stroke={colors.accent}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({p.rating?.rate || 0})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <p
                    className="font-bold text-lg mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ${p.price}
                  </p>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(p)}
                    className="mt-auto w-full py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div
            className={`p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between mb-6 pb-3 border-b"
              style={{
                borderColor: darkMode ? "#374151" : colors.accent + "40",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h3
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Edit Product
                </h3>
              </div>
              <button
                onClick={() => setEditProduct(null)}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Preview */}
            <div
              className={`mb-6 p-4 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={editProduct.image}
                  alt={editProduct.title}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {editProduct.title}
                  </p>
                  <p className="text-xs" style={{ color: colors.primary }}>
                    Current Price: ${editProduct.price}
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    ID: #{editProduct.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  <span className="flex items-center gap-2">
                    <Package
                      className="w-4 h-4"
                      style={{ color: colors.primary }}
                    />
                    Product Title
                  </span>
                </label>
                <input
                  name="title"
                  value={editProduct.title}
                  onChange={handleChange}
                  placeholder="Product Title"
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
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
                  value={editProduct.price}
                  onChange={handleChange}
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
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
                  value={editProduct.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
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
                  value={editProduct.category}
                  onChange={handleChange}
                  className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-[#D9BBB0]"
                      : "bg-white border-gray-200 text-gray-900 focus:ring-[#AD9C8E]"
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                <span className="flex items-center gap-2">
                  <FileText
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  Description
                </span>
              </label>
              <textarea
                name="description"
                value={editProduct.description}
                onChange={handleChange}
                placeholder="Product Description"
                rows={4}
                className={`w-full border p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#D9BBB0]"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#AD9C8E]"
                }`}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Product
                  </>
                )}
              </button>

              <button
                onClick={() => setEditProduct(null)}
                className={`flex-1 py-3 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
