import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDollarSign, FaTrash } from "react-icons/fa";
import "tailwindcss/tailwind.css";
import { clearCartAsync } from "../../reducers/cartReducer";
import Cart from "./Cart";
import { Link } from "react-router-dom";
import ShowError from "../ShowError";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart_details, loading, error } = useSelector((state) => state.cart);

  if (cart_details.length === 0) {
    return (
      <div className="flex items-center justify-center my-16 ">
        <div className="w-[80vw] h-[35vh] md:w-[50vw] md:h-[50vh] flex flex-col items-center justify-center bg-white shadow-lg rounded-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-400">Cart is Empty</h1>
          <Link to="/" className="text-lg text-blue-500 underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart_details
    .reduce((acc, item) => acc + item.discounted_price * item.prod_quantity, 0)
    .toFixed(2);

  const handleClearCart = () => {
    dispatch(clearCartAsync());
  };

  return error ? (
    <ShowError errorMessage={error} />
  ) : (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left w-7/10 md:w-1/2">Product</th>
              <th className="hidden pb-2 w-2/10 md:table-cell">Quantity</th>
              <th className="pb-2 w-2/10 md:w-1/5">Price</th>
              <th className="pb-2 w-1/10">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart_details.map((item) => (
              <Cart
                key={item.id}
                productId={item.id}
                name={item.product_name}
                quantity={item.prod_quantity}
                price={item.discounted_price}
                image={item.product_image}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearCart}
            className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            <FaTrash className="mr-2" /> Clear Cart
          </button>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="mb-2">
          Subtotal: <FaDollarSign className="inline-block" /> {subtotal}
        </p>
        <p className="mb-4">Taxes and Shipping calculated at checkout</p>
        <Link
          to={"/checkout"}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
