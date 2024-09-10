import React, { useState, useEffect } from "react";
import {
  addProduct,
  createDescription,
  addProductColors
} from "../../services/adminApi";
import { listproducts } from "../../services";
import ProductCard from "./ProductCard";

const CreateProductComponent = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [file, setFile] = useState(null);
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await listproducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleAddColor = () => {
    if (newColor.trim() === "") return;
    setColors([...colors, newColor.trim()]);
    setNewColor("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await addProduct(
        productName,
        description,
        quantity,
        regularPrice,
        discountedPrice,
        file
      );
      if (response.id) {
        console.log(response)
        await addProductColors(response.id, colors);
      }
      if (response.error) {
        setError(response.error);
        setMessage("");
      } else {
        setMessage(response.Message);
        setError("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Description:
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter product description"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Quantity:
          </label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter quantity"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Regular Price:
            </label>
            <input
              type="number"
              value={regularPrice}
              onChange={e => setRegularPrice(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter regular price"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Discounted Price:
            </label>
            <input
              type="number"
              value={discountedPrice}
              onChange={e => setDiscountedPrice(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter discounted price"
            />
          </div>
        </div>
        {/* Add Colors Section */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Add Colors:
          </label>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter color"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5">
            {colors.map((color, index) => (
              <li key={index} className="text-gray-700">
                {color}
              </li>
            ))}
          </ul>
        </div>
        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Product Image:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Create Product
        </button>
      </form>
      {/* Success/Error Messages */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      
      {/* Product List Section */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-4">All Products</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  product_image={product.product_image}
                  name={product["Product name"]}
                  description={product.description}
                  quantity={product.quantity}
                  price={product.discounted_price}
                  regPrice={product.regular_price}
                  setProducts={setProducts}
                  products={products}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateProductComponent;
