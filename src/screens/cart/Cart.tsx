import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store/store";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../redux/slice/cart";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { cartItem } = useSelector((state: RootState) => state.cart);

  const totalAmount = cartItem.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const gst = totalAmount * 0.18;
  const deliveryFee = 2;
  const finalAmount = totalAmount + gst + deliveryFee;

  if (cartItem.length === 0) {
    return <div className="p-10 text-center text-lg">🛒 Cart is empty</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-sm font-bold mb-6">My Cart</h1>

      <div className="bg-white p-5 rounded-lg shadow grid grid-cols-3 gap-6">
        <div className="col-span-2 h-90 overflow-y-scroll">
          {cartItem.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-13 h-13 object-contain"
                />

                <h2 className="font-semibold text-xs line-clamp-2 w-50">
                  {item.title}
                </h2>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decreaseQty(item.id))}
                    className="px-1 py-1 bg-gray-300 rounded"
                  >
                    −
                  </button>

                  <span className="text-sm">{item.quantity}</span>

                  <button
                    onClick={() => dispatch(increaseQty(item.id))}
                    className="px-1 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>

                  <button
                    // onClick={() => dispatch(removeFromCart(item.id))}
                    onClick={() => {
                      setSelectedId(item.id);
                      setOpenModal(true);
                    }}
                    className="ml-2 text-red-500"
                  >
                    <Trash2 className="h-4" />
                  </button>
                </div>

                <p className="text-green-600 font-bold text-sm text-right">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-5 h-fit sticky top-6">
          <h2 className="text-sm font-bold mb-4">Bill Details</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Total amount:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>18% GST:</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm mb-3">
            <span>Delivery fee:</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>

          <hr className="my-3" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total Pay:</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>

          <button className="w-full mt-2 bg-black text-white text-xs py-2 rounded-lg hover:opacity-60 ">
            Click to Pay
          </button>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-90 shadow-lg">
            <h3 className="bg-white text-xs mt-1 py-2 font-semibold">
              Remove Item
            </h3>

            <p className=" text-xs font-normal mb-3">
              Are you sure you want to remove this item from cart?
            </p>

            <div className=" flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-1 border rounded text-xs bg-red-500 text-white"
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
                className="px-3 py-1 border rounded text-xs bg-red-500 text-white"
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
