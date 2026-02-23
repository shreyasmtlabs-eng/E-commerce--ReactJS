import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slice/product";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/slice/auth";
import { useLocation } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const categoryRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [index, setIndex] = useState(0);
  const [selectedcategory, setSelectedcategory] = useState("all");
  const [showcategory, setShowcategory] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [filter, setFilter] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  // const { products, loading } = useSelector(
  //   (state: RootState) => state.products,
  // );

  const { products: reduxProducts, loading } = useSelector(
    (state: RootState) => state.products,
  );
  console.log("Redux Products API Response:>>>>>>", reduxProducts);

  const allProducts = [...reduxProducts];

  // const banners = [
  //   "/myImg2.png",
  //   "/myImg3.png",
  //   "/myImg4.png",
  //   "/myImg5.png",
  //   "/myImg6.png",
  //   "/lipstick.webp",
  // ];

  // console.log(
  //   "All API Categories:>>>>",
  //   allProducts.map((p) => p.category),
  // );
  const bannerImages = reduxProducts.slice(0, 20).map((p) => p.image);

  const categories = [
    "all",
    "women's clothing",
    "men's clothing",
    "men",
    "jewelery",
    "electronics",
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowcategory(false);
      }

      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    console.log(" state cleared:>>>>>>>");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black">
        <div className="flex justify-between w-full">
          <div className="flex gap-6">
            <img
              src="/smtlabs.jpg"
              alt="logo"
              className="h-8 w-auto cursor-pointer"
            />
            <button
              onClick={() => navigate("/all")}
              className="text-white font-semibold hover:underline"
            >
              All
            </button>

            <button
              onClick={() => navigate("/about")}
              className="text-white font-semibold hover:underline"
            >
              About
            </button>

            <div ref={filterRef} className="relative">
              <button
                onClick={() => setFilter(!filter)}
                className="text-white font-semibold hover:underline mt-1"
              >
                Filter
              </button>

              {filter && (
                <div className="absolute left-0 top-full mt-2 bg-white text-black shadow-lg rounded w-56 z-50">
                  <div
                    onClick={() => {
                      setSortBy("lowToHigh");
                      setFilter(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    Price: Low → High
                  </div>

                  <div
                    onClick={() => {
                      setSortBy("highToLow");
                      setFilter(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    Price: High → Low
                  </div>

                  <div
                    onClick={() => {
                      setSortBy("aToZ");
                      setFilter(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    A → Z
                  </div>

                  <div
                    onClick={() => {
                      setSortBy("zToA");
                      setFilter(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    Z → A
                  </div>

                  <div
                    onClick={() => {
                      setSortBy("");
                      setFilter(false);
                    }}
                    className="px-4 py-2 hover:bg-red-100 cursor-pointer text-sm text-red-600"
                  >
                    Clear Filter
                  </div>
                </div>
              )}
            </div>

            <div
              ref={categoryRef}
              className="relative"
              // onMouseEnter={() => setShowcategory(true)}
              // onMouseLeave={() => setShowcategory(false)}
            >
              <button
                onClick={() => setShowcategory(!showcategory)}
                className="text-white font-semibold hover:underline mt-1"
              >
                Category
              </button>

              {showcategory && (
                <div className="absolute left-0 top-full mt-2 bg-white text-black shadow-lg rounded w-56 z-50">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedcategory(cat);
                        setShowcategory(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm capitalize"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-white font-semibold hover:underline mt-1.5"
              >
                More
              </button>

              {showMore && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded w-52 z-50">
                  <div
                    onClick={() => navigate("/AddProduct")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    Add Product
                  </div>

                  <div
                    onClick={() => navigate("/UpdateProduct")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    Update Product
                  </div>

                  <div
                    onClick={() => navigate("/DeleteProduct")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-red-600"
                  >
                    Delete Product
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="text-white font-semibold hover:underline mt-1"
            >
              Logout
            </button>
          </div>
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
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-4 py-2 text-2xl rounded-full mt-2"
          >
            ‹
          </button>

          <button
            onClick={() => setIndex((index + 1) % bannerImages.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-4 py-2 text-2xl rounded-full"
          >
            ›
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

                    <div className="mt-1">
                      <span className="text-lg font-bold">${p.price}</span>
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
    </div>
  );
}
