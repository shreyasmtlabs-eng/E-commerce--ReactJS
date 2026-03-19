import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../../redux/store/store";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/slice/cart";
import { Trash2 } from "lucide-react";

export default function Checkout() {
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state: RootState) => state.cart);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("addresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const totalAmount = cartItem.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const gst = totalAmount * 0.18;
  const deliveryFee = 20;
  const finalAmount = totalAmount + gst + deliveryFee;

  const handleAddAddress = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.city ||
      !address.pincode ||
      !address.address
    ) {
      alert("Please fill all fields");
      return;
    }

    setAddresses([...addresses, address]);

    setAddress({
      name: "",
      phone: "",
      city: "",
      pincode: "",
      address: "",
    });
  };

  const handlePlaceorder = () => {
    if (selectedIndex === null) {
      alert("Please select address");
      return;
    }

    const order = {
      items: cartItem,
      address: addresses[selectedIndex],
      total: finalAmount,
    };

    console.log("Order Data:", order);
    alert("Order Successfully placed ✅");
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-6 transition-colors duration-200`}
    >
      <h1
        className={`text-lg font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        Checkout
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div
            className={` p-5 rounded-lg shadow transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <h2
              className={`font-semibold mb-4 text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Shipping
            </h2>

            <input
              value={address.name}
              placeholder="Full Name"
              className={`border p-1 w-full mb-2  text-xs rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
            />

            <input
              value={address.phone}
              placeholder="Mobile Number"
              className={`border p-1 w-full mb-2  text-xs rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />

            <input
              value={address.city}
              placeholder="City"
              className={`border p-1 w-full mb-2  text-xs rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white "
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />

            <input
              value={address.pincode}
              placeholder="Pincode"
              className={`border p-1 w-full mb-2  text-xs rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900 "
              }`}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />

            <textarea
              value={address.address}
              placeholder="Full Address"
              className={`border p-1 w-full mb-2  text-xs rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-white-900"
              }`}
              onChange={(e) =>
                setAddress({ ...address, address: e.target.value })
              }
            />

            <button
              onClick={handleAddAddress}
              className="bg-blue-600 text-white px-1 py-1 rounded mt-2 text-sm"
            >
              Save Address
            </button>
          </div>

          <div
            className={`p-2 rounded-lg shadow transition-colors ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {cartItem.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between mb-3 border-b pb-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-contain rounded"
                  />

                  <div className="flex flex-col">
                    <p
                      className={`text-xs font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </p>

                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 hover:text-red-600 mr-3"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <h2
              className={`font-semibold mb-3 text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Select Address
            </h2>

            {addresses.length === 0 && (
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                No address added yet
              </p>
            )}

            {addresses.map((addr, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`p-3 border rounded mb-2 cursor-pointer ${
                  selectedIndex === index
                    ? darkMode
                      ? "border-blue-400 bg-blue-900/30"
                      : "border-blue-500 bg-pink-50"
                    : darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p
                  className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {addr.name}
                </p>
                <p
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {addr.address}, {addr.city} - {addr.pincode}
                </p>
                <p
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {addr.phone}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-5 rounded-lg shadow h-fit sticky top-6 transition-colors ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`font-semibold mb-4  text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Price Details
          </h2>

          <div
            className={`flex justify-between text-sm mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <div
            className={`flex justify-between text-sm mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div
            className={`flex justify-between text-sm mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <hr
            className={`flex justify-between text-sm mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />

          <div
            className={`flex justify-between font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <span>Total Pay</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceorder}
            className="w-full mt-3 bg-blue-600 text-white py-1 rounded-lg hover:opacity-80 text-sm"
          >
            ORDER PLACE
          </button>
        </div>
      </div>
    </div>
  );
}
