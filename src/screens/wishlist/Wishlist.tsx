import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { addToCart } from "../../redux/slice/cart";

export default function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold mb-6">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((p) => (
            <div
              key={p.id}
              className="bg-white p-3 shadow rounded flex flex-col"
            >
              <img src={p.image} className="w-full h-[130px] object-contain" />
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
  );
}
