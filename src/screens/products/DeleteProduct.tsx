import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "../../utils/api/productsApi";
import { api } from "../../utils/api/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { colors } from "../../assets/constants/color";
import {
  Trash2,
  AlertTriangle,
  Package,
  Search,
  ArrowLeft,
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

export default function DeleteProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteProductItem, setDeleteProductItem] = useState<Product | null>(
    null,
  );
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

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: (_, id) => {
      const stored: Product[] = JSON.parse(
        localStorage.getItem("customProducts") || "[]",
      );
      const updated = stored.filter((p: Product) => p.id !== id);

      localStorage.setItem("customProducts", JSON.stringify(updated));

      queryClient.setQueryData<Product[]>(["products"], (old = []) =>
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
        <div className="flex items-center justify-between mb-8">
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
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Delete Products
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select a product to remove from your store
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
            style={{ "--ring-color": colors.primary } as React.CSSProperties}
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
                : "No products available to delete"}
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

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(p)}
                    className="mt-auto w-full py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                    style={{
                      background: `${colors.primary}`,
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProductItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div
            className={`p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#ef444420" }}
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
              <p
                className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Are you sure you want to delete this product?
              </p>

              {/* Product Preview */}
              <div
                className={`p-3 rounded-xl mb-6 ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={deleteProductItem.image}
                    alt={deleteProductItem.title}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="text-left flex-1">
                    <p
                      className={`text-xs font-medium line-clamp-1 ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {deleteProductItem.title}
                    </p>
                    <p className="text-xs" style={{ color: colors.primary }}>
                      ${deleteProductItem.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteProductItem(null)}
                className={`flex-1 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, #ef4444, #dc2626)`,
                }}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
