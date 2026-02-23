import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api/api";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slice/product";
import type { AppDispatch } from "../../redux/store/store";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rating: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/products", {
        ...form,
        price: Number(form.price),
      });

      // dispatch(addProduct(res.data));
      dispatch(
        addProduct({
          ...res.data,
          id: Date.now(),
        }),
      );

      navigate("/home", {
        state: { message: "Product Added Successfully" },
      });
    } catch (err) {
      alert("Failed to Add Product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Product Title"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="Rating"
            placeholder="Rating"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4 h-28"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
