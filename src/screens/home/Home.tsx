import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../utils/api/productsApi";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/slice/auth";
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
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const [selectedcategory, setSelectedcategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [drawerMoreOpen, setDrawerMoreOpen] = useState(false);
  const [drawerCategoryOpen, setDrawerCategoryOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  useEffect(() => {
    if (userGender === "female") {
      setSelectedcategory("women's clothing");
    } else if (userGender === "male") {
      setSelectedcategory("men's clothing");
    }
  }, [userGender]);

  const filteredProducts = products.filter((p) => {
    const category = p.category?.toLowerCase().trim();

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
      // return category === selectedcategory;
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

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {openDrawer && (
        <div
          onClick={() => setOpenDrawer(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform
        ${openDrawer ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between p-4">
          <h2 className="font-semibold">Menu</h2>

          <button onClick={() => setOpenDrawer(false)}>
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
            onClick={() => setDrawerCategoryOpen(!drawerCategoryOpen)}
            className="flex justify-between cursor-pointer p-2 font-normal"
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
            className="flex justify-between cursor-pointer p-2 font-normal"
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
                    : "hover:bg-gray-100"
                }`}
              >
                Z → A
              </div>
            </div>
          )}

          <div
            onClick={() => setDrawerMoreOpen(!drawerMoreOpen)}
            className="flex justify-between cursor-pointer p-2 font-normal"
          >
            More
            {drawerMoreOpen ? <ChevronUp /> : <ChevronDown />}
          </div>

          {drawerMoreOpen && (
            <div className="space-y-1">
              <div
                onClick={() => navigate("/AddProduct")}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Add Product
              </div>

              <div
                onClick={() => navigate("/UpdateProduct")}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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

      <div className="flex items-center px-4 py-3 bg-black">
        <button onClick={() => setOpenDrawer(true)} className="text-white">
          <Menu />
        </button>

        <img src="/smtlabs.jpg" className="h-8 ml-3 cursor-pointer" />

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

      {bannerImages.length > 0 && (
        <div className="relative w-full h-[60vh] bg-white overflow-hidden">
          <img
            src={bannerImages[index]}
            className="w-full h-full object-contain"
          />

          <button
            onClick={() =>
              setIndex(index === 0 ? bannerImages.length - 1 : index - 1)
            }
            className="absolute left-4 top-1/2"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => setIndex((index + 1) % bannerImages.length)}
            className="absolute right-4 top-1/2"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      <div className="px-6 py-10">
        <h2 className="text-xl font-bold mb-6">Today's Deals</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-full text-center">Loading Products...</p>
          ) : (
            sortedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded shadow hover:shadow-lg flex flex-col h-full"
              >
                <img
                  onClick={() => navigate(`/product/${p.id}`, { state: p })}
                  src={p.image}
                  className="w-full h-[200px] object-contain cursor-pointer"
                />

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>Are you sure you want to logout?</p>
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3 py-1 border"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="px-3 py-1 bg-red-500 text-white"
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
