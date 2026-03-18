import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { addToCart } from "../../redux/slice/cart";
import { useEffect } from "react";
export default function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();
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
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-[#f5f5f5]"}`}
    >
      <div className={`p-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
        <h2 className="text-sm font-semibold mb-6">My Wishlist</h2>

        {wishlistItems.length === 0 ? (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            No items in wishlist
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.map((p) => (
              <div
                key={p.id}
                className={`p-3 shadow rounded flex flex-col ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <img
                  src={p.image}
                  className="w-full h-[130px] object-contain"
                />
                <h3 className="text-sm mt-2 line-clamp-2">{p.title}</h3>
                <p className="font-bold mt-1 mb-2">${p.price}</p>

                <button
                  onClick={() => dispatch(addToCart(p))}
                  className="mt-auto bg-blue-600 text-white text-xs px-2 py-1 ml-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
