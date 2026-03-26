import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { addToCart } from "../../redux/slice/cart";
import { removeFromWishlist } from "../../redux/slice/wishlist";
import { useEffect } from "react";
import { ShoppingCart, Heart, Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../assets/constants/color";

export default function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              My Wishlist
            </h2>
            {wishlistItems.length > 0 && (
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: darkMode
                    ? colors.dark + "40"
                    : colors.primary + "20",
                  color: darkMode ? colors.primary : colors.secondary,
                }}
              >
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={() => navigate("/")}
              className="text-sm flex items-center gap-1 transition-colors hover:underline"
              style={{ color: colors.secondary }}
            >
              Continue Shopping
              <Sparkles className="w-3 h-3" />
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: darkMode
                  ? colors.dark + "30"
                  : colors.primary + "20",
              }}
            >
              <Heart className="w-12 h-12" style={{ color: colors.primary }} />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Your wishlist is empty
            </h3>
            <p
              className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Save your favorite items here
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((p) => (
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
                <div
                  className="relative cursor-pointer overflow-hidden rounded-t-2xl p-4"
                  onClick={() => navigate(`/product/${p.id}`, { state: p })}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-[180px] object-contain transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromWishlist(p.id));
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-50"
                    style={{ color: colors.dark }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <span
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: colors.accent }}
                  >
                    {p.category}
                  </span>

                  <h3
                    className={`text-sm font-semibold line-clamp-2 leading-relaxed mb-2 cursor-pointer hover:underline`}
                    onClick={() => navigate(`/product/${p.id}`, { state: p })}
                  >
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3 h-3"
                        fill={i < 4 ? colors.primary : "none"}
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
                    <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                  </div>

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

                  <button
                    onClick={() => dispatch(addToCart(p))}
                    className="mt-auto w-full py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 pt-6 text-center">
            <p
              className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Items in your wishlist are saved until you remove them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
