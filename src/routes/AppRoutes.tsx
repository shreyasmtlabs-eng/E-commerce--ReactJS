import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registration from "../screens/registration/Registration";
import Login from "../screens/loginsignup/Login";
import Home from "../screens/home/Home";
import Career from "../screens/career/Career";
import About from "../screens/about/About";
import All from "../screens/all/All";
import AddProduct from "../screens/products/AddProduct";
import UpdateProduct from "../screens/products/UpdateProduct";
import DeleteProduct from "../screens/products/DeleteProduct";
import Category from "../screens/category/Category";
import ProductDetails from "../screens/productdetails/ProductDetails";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/all" element={<All />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="updateproduct" element={<UpdateProduct />} />
        <Route path="deleteproduct" element={<DeleteProduct />} />
        <Route path="category" element={<Category />} />
        <Route path="career" element={<Career />} />
        <Route path="about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
