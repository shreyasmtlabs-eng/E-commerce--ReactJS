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

import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/firebase";
import { colors } from "../../assets/constants/color";
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
  Sparkles,
  Tag,
  Star,
  Shield,
  Truck,
  ArrowRight,
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

  useEffect(() => {
    logEvent(analytics, "page_view", {
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div
        className={`${
          darkMode
            ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            : `bg-linear-to-br from-[#F5EFEA] via-[#FDF8F5] to-[#F5EFEA] text-gray-800`
        } min-h-screen transition-all duration-300`}
      >
        {openDrawer && (
          <div
            onClick={() => setOpenDrawer(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out shadow-2xl
          ${openDrawer ? "translate-x-0" : "-translate-x-full"}
          ${
            darkMode
              ? "bg-to-linear-gray-800 to-gray-900 text-white"
              : `bg-linear-to-br from-white to-[#FDF8F5] text-gray-800`
          } backdrop-blrur-sm`}
        >
          <div
            className="flex justify-between items-center p-5 border-b"
            style={{ borderColor: darkMode ? "#374151" : colors.accent + "40" }}
          >
            <h2
              className="font-bold text-xl"
              style={{ color: darkMode ? colors.primary : colors.secondary }}
            >
              Menu
            </h2>
            <button
              onClick={() => setOpenDrawer(false)}
              className={`p-2 rounded-full transition-all duration-200 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-2 text-sm">
            <div
              onClick={() => {
                navigate("/");
                setOpenDrawer(false);
              }}
              className={`cursor-pointer p-3 rounded-xl transition-all duration-200 font-medium ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              } flex items-center gap-3`}
            >
              <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
              Home
            </div>

            <div
              onClick={() => setDrawerCategoryOpen(!drawerCategoryOpen)}
              className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-all duration-200 font-medium ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Tag className="w-4 h-4" style={{ color: colors.accent }} />
                Category
              </span>
              {drawerCategoryOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>

            {drawerCategoryOpen && (
              <div className="ml-8 space-y-1 overflow-hidden animate-in slide-in-from-left-5 duration-200">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedcategory(cat);
                      setOpenDrawer(false);
                    }}
                    className={`px-4 py-2 cursor-pointer capitalize rounded-lg transition-all duration-200 text-sm
                  ${
                    selectedcategory === cat
                      ? "text-white shadow-md"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700/50"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                    style={
                      selectedcategory === cat
                        ? {
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                          }
                        : {}
                    }
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => setDrawerFilterOpen(!drawerFilterOpen)}
              className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-all duration-200 font-medium ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Star className="w-4 h-4" style={{ color: colors.primary }} />
                Filter & Sort
              </span>
              {drawerFilterOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {drawerFilterOpen && (
              <div className="ml-8 space-y-1 animate-in slide-in-from-left-5 duration-200">
                <div
                  onClick={() => setSortBy("lowToHigh")}
                  className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                    sortBy === "lowToHigh"
                      ? "text-white"
                      : darkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-100"
                  }`}
                  style={
                    sortBy === "lowToHigh"
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }
                      : {}
                  }
                >
                  Price Low → High
                </div>

                <div
                  onClick={() => setSortBy("highToLow")}
                  className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                    sortBy === "highToLow"
                      ? "text-white"
                      : darkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-100"
                  }`}
                  style={
                    sortBy === "highToLow"
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }
                      : {}
                  }
                >
                  Price High → Low
                </div>

                <div
                  onClick={() => setSortBy("aToZ")}
                  className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                    sortBy === "aToZ"
                      ? "text-white"
                      : darkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-100"
                  }`}
                  style={
                    sortBy === "aToZ"
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }
                      : {}
                  }
                >
                  A → Z
                </div>

                <div
                  onClick={() => setSortBy("zToA")}
                  className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                    sortBy === "zToA"
                      ? "text-white"
                      : darkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-100"
                  }`}
                  style={
                    sortBy === "zToA"
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }
                      : {}
                  }
                >
                  Z → A
                </div>
              </div>
            )}

            <div
              onClick={() => setDrawerMoreOpen(!drawerMoreOpen)}
              className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-all duration-200 font-medium ${
                darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Shield className="w-4 h-4" style={{ color: colors.accent }} />
                More
              </span>
              {drawerMoreOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {drawerMoreOpen && (
              <div className="ml-8 space-y-1 animate-in slide-in-from-left-5 duration-200">
                <div
                  onClick={() => navigate("/AddProduct")}
                  className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
                  }`}
                >
                  Add Product
                </div>

                <div
                  onClick={() => navigate("/UpdateProduct")}
                  className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
                  }`}
                >
                  Update Product
                </div>

                <div
                  onClick={() => navigate("/DeleteProduct")}
                  className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer rounded-lg transition-all duration-200"
                >
                  Delete Product
                </div>
              </div>
            )}

            <div
              onClick={() => setShowLogoutModal(true)}
              className="cursor-pointer text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-3 mt-4"
            >
              <span className="text-lg">🚪</span>
              Logout
            </div>
          </div>
        </div>

        {/* Header */}
        <div
          className={`sticky top-0 z-30 flex items-center px-6 py-4 ${
            darkMode
              ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-700"
              : `bg-white/90 backdrop-blur-md shadow-sm border-b`
          }`}
          style={
            !darkMode
              ? {
                  borderColor: colors.accent + "40",
                  background: "rgba(255,255,255,0.9)",
                }
              : {}
          }
        >
          <button
            onClick={() => setOpenDrawer(true)}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            className="flex items-center gap-2 ml-4 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div
            // className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            // style={{
            //   background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            // }}
            >
              {/* <Sparkles className="w-5 h-5 text-white" /> */}
              <img src="/smtlabs.jpg" className="h-10 mr-5 cursor-pointer" />
            </div>
            <span
              className="font-bold text-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ShopNow
            </span>
          </div>

          <div className="flex-1 max-w-md mx-6">
            <div
              className={`relative flex items-center w-full rounded-2xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-opacity-50 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-50 border"
              }`}
              style={
                !darkMode
                  ? ({
                      borderColor: colors.accent,
                      "--ring-color": colors.primary,
                    } as React.CSSProperties)
                  : {}
              }
            >
              <Search
                className={`absolute left-4 w-4 h-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  logEvent(analytics, "search", {
                    search_term: e.target.value,
                  });
                }}
                className={`w-full pl-10 pr-4 py-2.5 outline-none text-sm rounded-2xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 text-white placeholder-gray-500"
                    : "bg-gray-50 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/wishlist")}
              className="relative cursor-pointer p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>

            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <SunMoon
                  className="w-5 h-5"
                  style={{ color: colors.primary }}
                />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Category Slider */}
        <div
          className={`relative py-8 px-6 ${
            darkMode ? "bg-gray-800/50" : "bg-white/50"
          } backdrop-blur-sm`}
        >
          <button
            onClick={scrollLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-3 z-10 transition-all duration-200 shadow-lg hover:scale-110 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-8 overflow-x-hidden scroll-smooth"
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
                onClick={() => {
                  setSelectedcategory(item.name.toLowerCase().trim());
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
                className="flex flex-col items-center cursor-pointer min-w-[110px] group"
              >
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}40, ${colors.accent}40)`,
                  }}
                >
                  <img
                    src={item.img}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <p
                  className={`text-xs text-center mt-3 font-medium capitalize transition-all duration-200 ${
                    darkMode
                      ? "text-gray-300 group-hover:text-[#D9BBB0]"
                      : "text-gray-700 group-hover:text-[#AD9C8E]"
                  }`}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-3 z-10 transition-all duration-200 shadow-lg hover:scale-110 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {bannerImages.length > 0 && (
          <div
            className={`relative w-full h-[70vh] overflow-hidden ${
              darkMode ? "bg-gray-900" : "bg-linear-to-b from-gray-50 to-white"
            }`}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent z-10" />
            <img
              src={bannerImages[index]}
              className="w-full h-full object-contain transition-all duration-500"
            />

            <button
              onClick={() =>
                setIndex(index === 0 ? bannerImages.length - 1 : index - 1)
              }
              className={`absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-xl z-20 ${
                darkMode
                  ? "bg-gray-800/80 text-white backdrop-blur-sm"
                  : "bg-white/80 text-gray-900 backdrop-blur-sm"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIndex((index + 1) % bannerImages.length)}
              className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-xl z-20 ${
                darkMode
                  ? "bg-gray-800/80 text-white backdrop-blur-sm"
                  : "bg-white/80 text-gray-900 backdrop-blur-sm"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20"></div>
          </div>
        )}

        {/* Products Section */}
        <div className="px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } flex items-center gap-2`}
            >
              Today's Deals
            </h2>
            {selectedcategory !== "all" && (
              <button
                onClick={() => setSelectedcategory("all")}
                className="text-sm flex items-center gap-1 transition-colors"
                style={{ color: colors.secondary }}
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div
                  className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: colors.primary,
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            ) : (
              sortedProducts.map((p) => (
                <div
                  key={p.id}
                  className={`group relative p-5 rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full ${
                    darkMode
                      ? "bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm border border-gray-700"
                      : "bg-white hover:shadow-2xl shadow-md border"
                  }`}
                  style={!darkMode ? { borderColor: colors.accent + "60" } : {}}
                >
                  <div
                    onClick={() => {
                      logEvent(analytics, "view_product", {
                        product_id: p.id,
                        product_name: p.title,
                      });
                      navigate(`/product/${p.id}`, { state: p });
                    }}
                    className="cursor-pointer overflow-hidden rounded-xl"
                  >
                    <img
                      src={p.image}
                      className="w-full h-[220px] object-contain transition-all duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute top-4 right-4 cursor-pointer z-10">
                    <Heart
                      onClick={() => {
                        const exists = wishlistItems.some(
                          (item) => item.id === p.id,
                        );

                        if (exists) {
                          logEvent(analytics, "remove_from_wishlist", {
                            product_id: p.id,
                          });
                          dispatch(removeFromWishlist(p.id));
                        } else {
                          logEvent(analytics, "add_to_wishlist", {
                            product_id: p.id,
                          });
                          dispatch(addToWishlist(p));
                        }
                      }}
                      className={`w-5 h-5 transition-all duration-200 hover:scale-110 ${
                        wishlistItems.some((item) => item.id === p.id)
                          ? "text-red-500 fill-red-500"
                          : darkMode
                            ? "text-gray-500 hover:text-red-400"
                            : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </div>

                  <h3 className="text-sm font-semibold mt-4 line-clamp-2 leading-relaxed">
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-2">
                    <Star
                      className="w-3 h-3 fill-current"
                      style={{ color: colors.primary }}
                    />
                    <Star
                      className="w-3 h-3 fill-current"
                      style={{ color: colors.primary }}
                    />
                    <Star
                      className="w-3 h-3 fill-current"
                      style={{ color: colors.primary }}
                    />
                    <Star
                      className="w-3 h-3 fill-current"
                      style={{ color: colors.primary }}
                    />
                    <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
                    <span className="text-xs text-gray-500 ml-1">(128)</span>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4">
                    <span
                      className="font-bold text-xl"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ${p.price}
                    </span>

                    <button
                      onClick={() => {
                        logEvent(analytics, "add_to_cart", {
                          product_id: p.id,
                          product_name: p.title,
                          price: p.price,
                        });
                        dispatch(addToCart(p));
                      }}
                      className="text-white text-xs px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div
          className="px-8 py-12 border-t"
          style={{ borderColor: colors.accent + "40" }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders over $50",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                desc: "100% safe checkout",
              },
              { icon: Star, title: "Quality Guarantee", desc: "Best products" },
              {
                icon: Heart,
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.dark}, #5a5655)`,
          }}
        >
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-center py-4 cursor-pointer hover:opacity-90 transition-all duration-200 font-medium"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.dark})`,
            }}
          >
            Back to top ↑
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-bold mb-4" style={{ color: colors.primary }}>
                Get to Know Us
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Products
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Press Releases
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Amazon Science
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4" style={{ color: colors.primary }}>
                Connect with Us
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Facebook
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Twitter
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Instagram
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4" style={{ color: colors.primary }}>
                Make Money with Us
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Sell on Amazon
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Become an Affiliate
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Advertise Your Products
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Fulfilment by Amazon
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4" style={{ color: colors.primary }}>
                Let Us Help You
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Your Account
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Returns Centre
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  100% Purchase Protection
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Help
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 py-6 text-center text-xs text-gray-400">
            © 2026 ShopLuxe — All Rights Reserved
          </div>
        </footer>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div
              className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: colors.primary + "20" }}
                >
                  <span className="text-3xl">🚪</span>
                </div>
                <p className="text-lg font-semibold mb-2">Ready to leave?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to logout?
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
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
                    dispatch(logout());
                    navigate("/login");
                  }}
                  className="flex-1 px-4 py-2 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
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
