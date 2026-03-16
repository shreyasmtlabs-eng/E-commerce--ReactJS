import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../utils/api/productsApi";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/slice/auth";
import { addToCart } from "../../redux/slice/cart";
import { addToWishlist, removeFromWishlist } from "../../redux/slice/wishlist";
import { toggleDarkMode } from "../../redux/slice/darkMode";
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Heart,
  Moon,
  SunMoon,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const [selectedcategory, setSelectedcategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [drawerMoreOpen, setDrawerMoreOpen] = useState(false);
  const [drawerCategoryOpen, setDrawerCategoryOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const cartCount = useSelector((state: RootState) =>
    state.cart.cartItem.reduce((total, item) => total + item.quantity, 0),
  );

  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;
  const user = useSelector((state: RootState) => state.auth.user);
  const userGender = user?.gender;
  const bannerImages = products.slice(0, 10).map((p) => p.image);

  useEffect(() => {
    if (bannerImages.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerImages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const categories = [
    "all",
    "women's clothing",
    "men's clothing",
    "jewelery",
    "electronics",
  ];

  const filteredProducts = products.filter((p) => {
    const category = p.category?.toLowerCase().trim();
    const title = p.title?.toLowerCase() || "";
    const search = searchText.toLowerCase();

    if (search && !title.includes(search) && !category.includes(search)) {
      return false;
    }

    if (selectedcategory !== "all" && searchText === "") {
      return category === selectedcategory;
    }

    if (category === "electronics") {
      return true;
    }

    if (userGender === "female") {
      if (selectedcategory === "all") {
        return (
          category === "women's clothing" ||
          category === "jewelery" ||
          category === "electronics"
        );
      }

      return category === selectedcategory || category === "jewelery";
    }

    if (userGender === "male") {
      if (selectedcategory === "all") {
        return category === "men's clothing" || category === "electronics";
      }
      return category === selectedcategory;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.price - b.price;
    if (sortBy === "highToLow") return b.price - a.price;
    if (sortBy === "aToZ") return a.title.localeCompare(b.title);
    if (sortBy === "zToA") return b.title.localeCompare(a.title);
    return 0;
  });

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    // <div className="min-h-screen bg-[#f5f5f5]">
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div
        className={`${darkMode ? "bg-gray-900 text-white" : "bg-[#f5f5f5] text-gray-900"} min-h-screen transition-colors duration-200`}
      >
        {openDrawer && (
          <div
            onClick={() => setOpenDrawer(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}

        {/* <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform
        ${openDrawer ? "translate-x-0" : "-translate-x-full"}`}
      > */}

        <div
          className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform
          ${openDrawer ? "translate-x-0" : "-translate-x-full"}
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
        >
          <div className="flex justify-between p-4">
            <h2 className="font-semibold">Menu</h2>
            <button
              onClick={() => setOpenDrawer(false)}
              className={darkMode ? "text-gray-300" : ""}
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
              // className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              className={`cursor-pointer p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              Home
            </div>

            <div
              onClick={() => setDrawerCategoryOpen(!drawerCategoryOpen)}
              // className="flex justify-between cursor-pointer p-2 font-normal"
              className={`flex justify-between cursor-pointer p-2 font-normal ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              Category
              {drawerCategoryOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {drawerCategoryOpen && (
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedcategory(cat);
                      setOpenDrawer(false);
                    }}
                    className={`px-3 py-2 cursor-pointer capitalize
                  ${
                    selectedcategory === cat
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => setDrawerFilterOpen(!drawerFilterOpen)}
              // className="flex justify-between cursor-pointer p-2 font-normal"
              className={`flex justify-between cursor-pointer p-2 font-normal ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              Filter
              {drawerFilterOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {drawerFilterOpen && (
              <div className="space-y-1">
                <div
                  onClick={() => setSortBy("lowToHigh")}
                  className={`px-3 py-2 cursor-pointer ${
                    sortBy === "lowToHigh"
                      ? "bg-green-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  Price Low → High
                </div>

                <div
                  onClick={() => setSortBy("highToLow")}
                  className={`px-3 py-2 cursor-pointer ${
                    sortBy === "highToLow"
                      ? "bg-green-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  Price High → Low
                </div>

                <div
                  onClick={() => setSortBy("aToZ")}
                  className={`px-3 py-2 cursor-pointer ${
                    sortBy === "aToZ"
                      ? "bg-green-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  A → Z
                </div>

                <div
                  onClick={() => setSortBy("zToA")}
                  className={`px-3 py-2 cursor-pointer ${
                    sortBy === "zToA"
                      ? "bg-green-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  Z → A
                </div>
              </div>
            )}

            <div
              onClick={() => setDrawerMoreOpen(!drawerMoreOpen)}
              // className="flex justify-between cursor-pointer p-2 font-normal"
              className={`flex justify-between cursor-pointer p-2 font-normal ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              More
              {drawerMoreOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {drawerMoreOpen && (
              <div className="space-y-1">
                <div
                  onClick={() => navigate("/AddProduct")}
                  // className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  className={`px-3 py-2 cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  Add Product
                </div>

                <div
                  onClick={() => navigate("/UpdateProduct")}
                  // className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  className={`px-3 py-2 cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  Update Product
                </div>

                <div
                  onClick={() => navigate("/DeleteProduct")}
                  className="px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                >
                  Delete Product
                </div>
              </div>
            )}

            <div
              onClick={() => setShowLogoutModal(true)}
              className="cursor-pointer text-red-600 hover:bg-red-100 p-2 rounded"
            >
              Logout
            </div>
          </div>
        </div>

        <div
          // className="flex items-center px-4 py-3 bg-black"
          className={`flex items-center px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-black"}`}
        >
          <button onClick={() => setOpenDrawer(true)} className="text-white">
            <Menu />
          </button>

          <img src="/smtlabs.jpg" className="h-8 ml-3 cursor-pointer" />

          <div className="flex items-center justify-start w-full ml-3">
            {/* <div className="relative bg-white flex items-center w-[40%] rounded-md overflow-hidden border border-gray-300"> */}

            <div
              className={`relative flex items-center w-[40%] rounded-md overflow-hidden border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
            >
              {/* <Search className="absolute right-2 w-4 h-4  text-gray-500" /> */}

              <Search
                className={`absolute right-2 w-4 h-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`}
              />

              <input
                type="text"
                placeholder="Search Product"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                // className="w-full pl-2 pr-2 py-1 mb-0.5 outline-none text-xs"
                className={`w-full pl-2 pr-2 py-1 mb-0.5 outline-none text-xs ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900"}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <div
              onClick={() => navigate("/wishlist")}
              className="relative cursor-pointer"
            >
              <Heart className="text-white w-6 h-6" />

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>

            <div
              onClick={() => navigate("/cart")}
              className="relative ml-auto cursor-pointer"
            >
              <ShoppingCart className="text-white" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="ml-5 text-white"
          >
            {darkMode ? <SunMoon /> : <Moon />}
          </button>
        </div>

        {/* <div className="bg-white py-6 px-4 "> */}
        <div
          className={`relative py-6 px-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <button
            onClick={scrollLeft}
            // className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10"
            className={`absolute left-0 top-1/2 -translate-y-1/2 shadow rounded-full p-2 z-10 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
          >
            <ChevronLeft />
          </button>

          {/* <div className="flex gap-8 min-w-max"> */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth"
          >
            {[
              { name: "men's clothing", img: "/mens clothing.png" },
              { name: "women's clothing", img: "/womensclothing.png" },
              { name: "jewelery", img: "/jewellery.png" },
              { name: "electronics", img: "/electronic.jpg" },
              { name: "footwear", img: "/footwears.png" },
              { name: "watches", img: "/watches.png" },
              { name: "bagss", img: "/bags.png" },
              { name: "beauty", img: "/beautyy.png" },
              { name: "eyewear", img: "/eyewear.png" },
            ].map((item, i) => (
              <div
                key={i}
                // onClick={() => setSelectedcategory(item.name)}
                onClick={() => {
                  setSelectedcategory(item.name.toLowerCase().trim());
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
                className="flex flex-col items-center cursor-pointer min-w-[110px]"
              >
                <div className="w-[90px] h-[90px] rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden shadow">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* <p className="text-xs text-center mt-2 font-medium capitalize"> */}

                <p
                  className={`text-xs text-center mt-2 font-medium capitalize ${darkMode ? "text-gray-300" : "text-gray-900"}`}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={scrollRight}
            // className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10"
            className={`absolute right-0 top-1/2 -translate-y-1/2 shadow rounded-full p-2 z-10 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
          >
            <ChevronRight />
          </button>
        </div>

        {bannerImages.length > 0 && (
          // <div className="relative w-full h-[60vh] bg-white overflow-hidden">
          <div
            className={`relative w-full h-[60vh] overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <img
              src={bannerImages[index]}
              className="w-full h-full object-contain"
            />

            <button
              onClick={() =>
                setIndex(index === 0 ? bannerImages.length - 1 : index - 1)
              }
              // className="absolute left-4 top-1/2"
              className={`absolute left-4 top-1/2 p-2 rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => setIndex((index + 1) % bannerImages.length)}
              // className="absolute right-4 top-1/2"
              className={`absolute right-4 top-1/2 p-2 rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
            >
              <ChevronRight />
            </button>
          </div>
        )}

        <div className="px-6 py-10">
          {/* <h2 className="text-xl font-bold mb-6">Today's Deals</h2> */}
          <h2
            className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Today's Deals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              // <p className="col-span-full text-center">Loading Products...</p>
              <p
                className={`col-span-full text-center ${darkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                Loading Products...
              </p>
            ) : (
              sortedProducts.map((p) => (
                <div
                  key={p.id}
                  // className="relative  bg-white p-4 rounded shadow hover:shadow-lg flex flex-col h-full"
                  className={`relative p-4 rounded shadow hover:shadow-lg flex flex-col h-full ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                >
                  <img
                    onClick={() => navigate(`/product/${p.id}`, { state: p })}
                    src={p.image}
                    className="w-full h-[200px] object-contain cursor-pointer"
                  />

                  <div className="absolute top-2 right-2 cursor-pointer">
                    <Heart
                      onClick={() => {
                        const exists = wishlistItems.some(
                          (item) => item.id === p.id,
                        );

                        if (exists) {
                          dispatch(removeFromWishlist(p.id));
                        } else {
                          dispatch(addToWishlist(p));
                        }
                      }}
                      className={`w-4 h-4 ${
                        wishlistItems.some((item) => item.id === p.id)
                          ? "text-red-500 fill-red-500"
                          : darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                      }`}
                    />
                  </div>

                  <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                    {p.title}
                  </h3>

                  <div className="flex justify-between  mt-auto pt-3">
                    <span className="font-bold">${p.price}</span>

                    <button
                      onClick={() => dispatch(addToCart(p))}
                      className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))
            )}
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
                  <li className="hover:underline cursor-pointer">
                    Your Account
                  </li>
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div
              // className="bg-white p-6 rounded"
              className={`p-6 rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            >
              <p>Are you sure you want to logout?</p>
              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  // className="px-3 py-1 border"
                  className={`px-3 py-1 border rounded ${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
