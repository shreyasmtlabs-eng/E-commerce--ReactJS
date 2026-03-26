import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store/store";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../redux/slice/cart";
import { Trash2, ShoppingBag, Truck, Shield, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../assets/constants/color";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { cartItem } = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const totalAmount = cartItem.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const gst = totalAmount * 0.18;
  const deliveryFee = totalAmount > 500 ? 0 : 20;
  const finalAmount = totalAmount + gst + deliveryFee;

  if (cartItem.length === 0) {
    return (
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA]"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: darkMode
                ? colors.dark + "30"
                : colors.primary + "20",
            }}
          >
            <ShoppingBag
              className="w-16 h-16"
              style={{ color: colors.primary }}
            />
          </div>
          <h2
            className={`text-2xl font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Your cart is empty
          </h2>
          <p
            className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Looks like you haven't added anything yet
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
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              My Cart
            </h1>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: darkMode
                  ? colors.dark + "40"
                  : colors.primary + "20",
                color: darkMode ? colors.primary : colors.secondary,
              }}
            >
              {cartItem.length} {cartItem.length === 1 ? "item" : "items"}
            </span>
          </div>

          <button
            onClick={() => navigate("/")}
            className="text-sm flex items-center gap-1 transition-colors hover:underline"
            style={{ color: colors.secondary }}
          >
            Continue Shopping
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl shadow-lg overflow-hidden ${
                darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white"
              }`}
              style={
                !darkMode
                  ? { boxShadow: "0 20px 35px -10px rgba(173, 156, 142, 0.2)" }
                  : {}
              }
            >
              <div className="max-h-[500px] overflow-y-auto">
                {cartItem.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b transition-all duration-200 hover:bg-opacity-50 ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700/30"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h2
                          className={`font-semibold text-sm line-clamp-2 mb-1 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </h2>
                        <span
                          className="text-xs uppercase tracking-wider"
                          style={{ color: colors.accent }}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dispatch(decreaseQty(item.id))}
                          className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-lg font-medium ${
                            darkMode
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          −
                        </button>

                        <span
                          className={`text-sm font-semibold w-8 text-center ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => dispatch(increaseQty(item.id))}
                          className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-lg font-medium ${
                            darkMode
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          +
                        </button>

                        <button
                          onClick={() => {
                            setSelectedId(item.id);
                            setOpenModal(true);
                          }}
                          className="ml-1 p-2 rounded-lg transition-all duration-200 hover:bg-red-50 group"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
                        </button>
                      </div>

                      <p
                        className="font-bold text-base min-w-[80px] text-right"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl shadow-lg p-6 sticky top-6 ${
                darkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white"
              }`}
              style={
                !darkMode
                  ? { boxShadow: "0 20px 35px -10px rgba(173, 156, 142, 0.2)" }
                  : {}
              }
            >
              <h2
                className={`text-lg font-bold mb-4 pb-3 border-b ${
                  darkMode
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                Order Summary
              </h2>

              <div className="space-y-3">
                <div
                  className={`flex justify-between text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <span>Subtotal ({cartItem.length} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>

                <div
                  className={`flex justify-between text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <span>GST (18%)</span>
                  <span>${gst.toFixed(2)}</span>
                </div>

                <div
                  className={`flex justify-between text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-500" : ""}>
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                {totalAmount > 500 && (
                  <div className="flex items-center gap-2 text-xs text-green-500 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <Truck className="w-3 h-3" />
                    <span>Free delivery on orders over $500!</span>
                  </div>
                )}

                <hr
                  className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                />

                <div
                  className={`flex justify-between font-bold text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <span>Total</span>
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ${finalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-4 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield
                    className="w-3 h-3"
                    style={{ color: colors.accent }}
                  />
                  <p
                    className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Secure checkout • 100% protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Delivery Banner */}
        {totalAmount > 0 && totalAmount < 500 && (
          <div
            className={`mt-6 p-4 rounded-xl flex items-center justify-between ${
              darkMode
                ? "bg-gray-800/50"
                : "bg-linear-to-r from-[#D9BBB0]/10 to-[#B3C5C2]/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5" style={{ color: colors.primary }} />
              <span
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Add ${(500 - totalAmount).toFixed(2)} more to get FREE delivery!
              </span>
            </div>
            <div className="w-32 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((totalAmount / 500) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Remove Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div
            className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <Trash2 className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Remove Item</h3>
              <p
                className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Are you sure you want to remove this item from your cart?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className={`flex-1 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedId !== null) {
                    dispatch(removeFromCart(selectedId));
                  }
                  setOpenModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
