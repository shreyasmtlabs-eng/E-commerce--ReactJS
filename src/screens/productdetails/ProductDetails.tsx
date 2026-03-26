import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cart";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store/store";
import type { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { colors } from "../../assets/constants/color";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  const reduxProduct = useSelector((state: RootState) =>
    state.products.products.find((p) => p.id === Number(id)),
  );

  const product = location.state || reduxProduct;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (!product) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-gray-900"
            : "bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA]"
        }`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2
            className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Product not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            Go Back
          </button>
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
      } py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-6xl mx-auto">
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

        {/* Product Card */}
        <div
          className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white"
          }`}
          style={
            !darkMode
              ? { boxShadow: "0 20px 35px -10px rgba(173, 156, 142, 0.2)" }
              : {}
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-8">
            {/* Product Image */}
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                }}
              />
              <div className="relative rounded-2xl overflow-hidden  dark:from-gray-700 dark:to-gray-800 p-8">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-[400px] sm:h-[500px] object-contain transition-transform duration-500"
                />
              </div>

              {/* Badge */}
              <div className="absolute top-4 left-4"></div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category */}
              <span
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: colors.accent }}
              >
                {product.category}
              </span>

              {/* Title */}
              <h1
                className={`text-2xl sm:text-3xl font-bold leading-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.floor(product?.rating?.rate)
                          ? "fill-current"
                          : darkMode
                            ? "text-gray-600"
                            : "text-gray-300"
                      }`}
                      style={
                        index < Math.floor(product?.rating?.rate)
                          ? { color: colors.primary, fill: colors.primary }
                          : {}
                      }
                    />
                  ))}
                </div>
                <span
                  className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {product?.rating?.rate}
                </span>
                <span
                  className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  ({product?.rating?.count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-6">
                <span className="text-3xl font-bold tracking-tight">
                  <span
                    className="bg-linear-to-r bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ${product.price}
                  </span>
                </span>
                <span
                  className={`text-sm ml-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  incl. taxes
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  In Stock • Ready to Ship
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addToCart(product));
                }}
                className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <ShoppingCart className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Add to Cart
              </button>

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <Truck
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  <span
                    className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Free Shipping
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <RotateCcw
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  <span
                    className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    30-Day Returns
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                className="mt-8 pt-6 border-t"
                style={{
                  borderColor: darkMode ? "#374151" : colors.accent + "40",
                }}
              >
                <h3
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <Shield
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  Product Description
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
