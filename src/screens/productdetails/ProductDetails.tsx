import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cart";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store/store";
import type { RootState } from "../../redux/store/store";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const reduxProduct = useSelector((state: RootState) =>
    state.products.products.find((p) => p.id === Number(id)),
  );

  const product = location.state || reduxProduct;

  if (!product) {
    return <div className="p-10 text-center"> Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[250px] sm:h-[350px] object-contain"
        />
        <div>
          <h1 className="text-xl font-bold"> {product.title}</h1>
          <div className="mt-4 flex flex-col gap-1 mb-0">
            <span className="  bg-red-600 text-white px-2 py-1  text-xs rounded w-fit">
              Best Seller
            </span>

            <span className="text-sl  justify-between font-bold text-green-600">
              Price ₹{product.price}
            </span>

            <span className=" text-gray-400 text-sm">
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
                      : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}

              <span className="text-sm text-gray-600 ml-2">
                {product?.rating?.rate}
              </span>
              <span className="text-sm text-gray-400 ml-2">
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

          <p className="mt-6 text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
