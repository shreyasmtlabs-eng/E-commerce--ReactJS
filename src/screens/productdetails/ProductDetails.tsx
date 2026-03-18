import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cart";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store/store";
import type { RootState } from "../../redux/store/store";
import { useEffect } from "react";

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
    return <div className="p-10 text-center"> Product not found</div>;
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-6`}
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        Back
      </button>

      <div
        className={`rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[250px] sm:h-[350px] object-contain"
        />

        <div>
          <h1
            className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {" "}
            {product.title}
          </h1>
          <div className="mt-4 flex flex-col gap-1 mb-0">
            <span className="  bg-red-600 text-white px-2 py-1  text-xs rounded w-fit">
              Best Seller
            </span>

            <span className="text-sl  justify-between font-bold text-green-600">
              Price ₹{product.price}
            </span>

            <span
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {" "}
              Category: {product.category}
            </span>

            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-lg ${
                    index < Math.floor(product?.rating?.rate)
                      ? "text-yellow-500"
                      : darkMode
                        ? "text-gray-600"
                        : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}

              <span
                className={`text-sm ml-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {product?.rating?.rate}
              </span>
              <span
                className={`text-sm ml-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                ({product?.rating?.count})
              </span>
            </div>

            <div className="flex justify-between items-center mt-3 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addToCart(product));
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded"
              >
                Add to cart
              </button>
            </div>
          </div>

          <p className={`mt-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
