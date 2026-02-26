import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slice/product";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/slice/auth";
import { useLocation } from "react-router-dom";
import { addToCart } from "../../redux/slice/cart";

import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const categoryRef = useRef<HTMLDivElement>(null);
  // const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const [selectedcategory, setSelectedcategory] = useState("all");
  // const [showcategory, setShowcategory] = useState(false);
  // const [showMore, setShowMore] = useState(false);
  // const [filter, setFilter] = useState(false);

  const [sortBy, setSortBy] = useState("");
  // const filterRef = useRef<HTMLDivElement>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [drawerMoreOpen, setDrawerMoreOpen] = useState(false);
  const [drawerCategoryOpen, setDrawerCategoryOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { products: reduxProducts, loading } = useSelector(
    (state: RootState) => state.products,
  );
  console.log("Redux Products API Response:>>>>>>", reduxProducts);

  const cartCount = useSelector((state: RootState) =>
    state.cart.cartItem.reduce((total, item) => total + item.quantity, 0),
  );

  const allProducts = [...reduxProducts];
  // const banners = [
  //   "/myImg2.png",
  //   "/myImg3.png",
  //   "/myImg4.png",
  //   "/myImg5.png",
  //   "/myImg6.png",
  //   "/lipstick.webp",
  // ];

  const bannerImages = reduxProducts.slice(0, 20).map((p) => p.image);
  const categories = [
    "all",
    "women's clothing",
    "men's clothing",
    "men",
    "women",
    "jewelery",
    "electronics",
    "footwear",
  ];

  // const filterProducts =
  //   selectedcategory === "all"
  //     ? allProducts
  //     : allProducts.filter((p) => p.category === selectedcategory);

  // useEffect(() => {
  //   dispatch(fetchProducts());
  // }, [dispatch]);

  const filterProducts =
    selectedcategory === "all"
      ? [...allProducts]
      : allProducts.filter(
          (p) =>
            p.category.toLowerCase().trim() ===
            selectedcategory.toLowerCase().trim(),
        );
  console.log("Filtered Products:>>>>", filterProducts);

  const sortedProducts = [...filterProducts].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.price - b.price;
    if (sortBy === "highToLow") return b.price - a.price;
    if (sortBy === "aToZ") return a.title.localeCompare(b.title);
    if (sortBy === "zToA") return b.title.localeCompare(a.title);
    return 0;
  });
  console.log("Sorted Products:>>>>", sortedProducts);

  useEffect(() => {
    // if (reduxProducts.length === 0) {
    dispatch(fetchProducts());
    // }
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       categoryRef.current &&
  //       !categoryRef.current.contains(event.target as Node)
  //     ) {
  //       setShowcategory(false);
  //     }

  //     if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
  //       setShowMore(false);
  //     }
  //     if (
  //       filterRef.current &&
  //       !filterRef.current.contains(event.target as Node)
  //     ) {
  //       setFilter(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {openDrawer && (
        <div
          onClick={() => setOpenDrawer(false)}
          className="fixed inset-0 bg-black/40  backdrop-blur-sm z-40 transition-opacity duration-300"
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out
            overflow-y-auto
  ${openDrawer ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <div className="flex justify-between items-center p-4 ">
          <h2 className="font-bold text-lg">Menu</h2>
          <button
            onClick={() => setOpenDrawer(false)}
            className="text-xl transition-transform hover:rotate-90 duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div
            onClick={() => {
              navigate("/");
              setOpenDrawer(false);
            }}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            Home
          </div>

          <div
            onClick={() => {
              navigate("/all");
              setOpenDrawer(false);
            }}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            All Products
          </div>

          <div
            onClick={() => {
              navigate("/about");
              setOpenDrawer(false);
            }}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            About
          </div>

          {/* <div className="border-t pt-3 font-semibold">Categories</div> */}
          <div
            onClick={() => setDrawerCategoryOpen(!drawerCategoryOpen)}
            className="flex justify-between items-center cursor-pointer font-semibold p-2 pt-3"
          >
            Category
            {drawerCategoryOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {/* <span>{drawerCategoryOpen ? "▲" : "▼"}</span> */}
          </div>

          {drawerCategoryOpen && (
            <div className="pl-3 space-y-1">
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setSelectedcategory(cat);
                    setOpenDrawer(false);
                  }}
                  // className="capitalize cursor-pointer hover:bg-gray-100 p-2 rounded"
                  className={`
    px-4 py-2 cursor-pointer text-sm capitalize
    ${
      selectedcategory === cat
        ? "bg-green-500 text-white font-semibold"
        : "hover:bg-gray-100 text-black"
    }
  `}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
          {/* <div className="border-t pt-3 font-semibold">Sort By</div> */}
          <div
            onClick={() => setDrawerFilterOpen(!drawerFilterOpen)}
            className="flex justify-between items-center cursor-pointer font-semibold p-2 pt-3"
          >
            {/* <span>{drawerFilterOpen ? "▲" : "▼"}</span> */}
            Filter
            {drawerFilterOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {drawerFilterOpen && (
            <div className="pl-3 space-y-1">
              <div
                onClick={() => {
                  setSortBy("lowToHigh");
                  setOpenDrawer(false);
                }}
                className={`
    px-4 py-2 cursor-pointer text-sm
    ${
      sortBy === "lowToHigh"
        ? "bg-green-500 text-white font-semibold"
        : "hover:bg-gray-100"
    }
  `}
              >
                Price: Low → High
              </div>

              <div
                onClick={() => {
                  setSortBy("highToLow");
                  setOpenDrawer(false);
                }}
                // className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                className={`px-4 py-2 cursor-pointer text-sm
        ${
          sortBy === "highToLow"
            ? "bg-green-500 text-white font-semibold"
            : "hover:bg-gray-100"
        }
      `}
              >
                Price: High → Low
              </div>

              <div
                onClick={() => {
                  setSortBy("aToZ");
                  setOpenDrawer(false);
                }}
                // className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                className={`px-4 py-2 cursor-pointer text-sm
        ${
          sortBy === "    A → Z"
            ? "bg-green-500 text-white font-semibold"
            : "hover:bg-gray-100"
        }
      `}
              >
                A → Z
              </div>

              <div
                onClick={() => {
                  setSortBy("zToA");
                  setOpenDrawer(false);
                }}
                // className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                className={`px-4 py-2 cursor-pointer text-sm
        ${
          sortBy === "   Z → A"
            ? "bg-green-500 text-white font-semibold"
            : "hover:bg-gray-100"
        }
      `}
              >
                Z → A
              </div>
            </div>
          )}

          <div
            onClick={() => setDrawerMoreOpen(!drawerMoreOpen)}
            className="flex justify-between items-center cursor-pointer font-semibold p-2 pt-3"
          >
            More
            {/* <span>{drawerMoreOpen ? "▲" : "▼"}</span> */}
            {drawerMoreOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {drawerMoreOpen && (
            <div className="pl-3 space-y-1">
              <div
                onClick={() => {
                  navigate("/AddProduct");
                  setOpenDrawer(false);
                }}
                className="px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 rounded"
              >
                Add Product
              </div>

              <div
                onClick={() => {
                  navigate("/UpdateProduct");
                  setOpenDrawer(false);
                }}
                className="px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 rounded"
              >
                Update Product
              </div>

              <div
                onClick={() => {
                  navigate("/DeleteProduct");
                  setOpenDrawer(false);
                }}
                className="px-4 py-2 cursor-pointer text-sm text-red-600 hover:bg-red-100 rounded"
              >
                Delete Product
              </div>
            </div>
          )}
          <div
            // onClick={() => {
            //   dispatch(logout());
            //   navigate("/login");
            // }}
            onClick={() => setShowLogoutModal(true)}
            className="cursor-pointer text-red-600 hover:bg-red-100 p-2 rounded"
          >
            Logout
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center px-4 sm:px-6 py-3 sm:py-4 bg-black">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpenDrawer(true)}
            className="text-white text-2xl"
          >
            <Menu className="w-6 h-6" />
          </button>

          <img
            src="/smtlabs.jpg"
            alt="logo"
            className="h-8 w-auto cursor-pointer  justify-start mb-2"
          />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer ml-auto"
        >
          <ShoppingCart className="text-white w-6 h-6" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] overflow-hidden bg-white">
          <img
            src={bannerImages[index]}
            alt="banner"
            className="w-full h-full object-contain transition-all duration-700"
          />

          <button
            onClick={() =>
              setIndex(index === 0 ? bannerImages.length - 1 : index - 1)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-2 text-2xl rounded-full mt-2"
          >
            <ChevronLeft className="w-4 h-5 " />
          </button>

          <button
            onClick={() => setIndex((index + 1) % bannerImages.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-2 text-2xl rounded-full"
          >
            <ChevronRight className="w-4 h-5 " />
          </button>
        </div>

        <div className="px-6 py-10 bg-[#f5f5f5]">
          <h2 className="text-xl font-bold mb-6">Today's Deals</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-center col-span-full">Loading Products.....</p>
            ) : (
              // filterProducts.map((p) => (
              sortedProducts.map((p) => (
                <div
                  key={p.id}
                  // onClick={() => navigate(`/product/${p.id}`, { state: p })}

                  className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    onClick={() => navigate(`/product/${p.id}`, { state: p })}
                    src={p.image}
                    alt={p.title}
                    className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-contain"
                  />

                  <div className="mt-3">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Best Seller
                    </span>

                    <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                      {p.title}
                    </h3>

                    <div className="flex justify-between items-center mt-1 ">
                      <span className="text-lg font-bold">${p.price}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToCart(p));
                        }}
                        className="bg-blue-600 text-white text-xs px-2 py-0 h-5 rounded justify-between
                         transition-all duration-150
   
    active:bg-green-700"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className=" justify-center h-[45vh] w-full">
        <footer className=" bg-[#232F3E] text-white">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-[#37475A] text-center py-3 cursor-pointer hover:bg-[#485769]"
          >
            Back to top
          </div>

          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-bold mb-3">Get to Know Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:underline cursor-pointer">About Us</li>
                <li className="hover:underline cursor-pointer">Products</li>
                <li className="hover:underline cursor-pointer">Careers</li>
                <li className="hover:underline cursor-pointer">
                  Press Releases
                </li>
                <li className="hover:underline cursor-pointer">
                  Amazon Science
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Connect with Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:underline cursor-pointer">Facebook</li>
                <li className="hover:underline cursor-pointer">Twitter</li>
                <li className="hover:underline cursor-pointer">Instagram</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Make Money with Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:underline cursor-pointer">
                  Sell on Amazon
                </li>
                <li className="hover:underline cursor-pointer">
                  Become an Affiliate
                </li>
                <li className="hover:underline cursor-pointer">
                  Advertise Your Products
                </li>
                <li className="hover:underline cursor-pointer">
                  Fulfilment by Amazon
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Let Us Help You</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:underline cursor-pointer">Your Account</li>
                <li className="hover:underline cursor-pointer">
                  Returns Centre
                </li>
                <li className="hover:underline cursor-pointer">
                  100% Purchase Protection
                </li>
                <li className="hover:underline cursor-pointer">Help</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 py-4 text-center text-xs text-gray-300">
            © 2026 YourShop.in — All Rights Reserved
          </div>
        </footer>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-80 shadow-lg">
            <h3 className="bg-white text-xs mt-1 py-2 font-semibold">
              Confirm Logout
            </h3>

            <p className="text-xs font-normal mb-3">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3 py-1 border rounded text-xs bg-red-500 text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="px-3 py-1 border rounded text-xs bg-red-500 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
