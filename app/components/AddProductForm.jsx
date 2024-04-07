"use client";
import React, { useState } from "react";
import Spinner from "./Spinner";
import { useAlert } from "react-alert";
import { useRouter } from "next/navigation";

const AddProductForm = ({ products, setProducts }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !price || !quantity) {
      alert.error("please enter all the input fields");
      return;
    }
    const existingProduct = products.find((product) => product.name === name);
    if (existingProduct) {
      alert.error("Product with same name already exists");
      return;
    }
    setIsLoading(true);
    // making the api call here
    const res = await fetch("/api/products", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ name, price, quantity }),
    });
    const data = await res.json();
    if (data.success) {
      setProducts((products) => [...products, data.product]);
      alert.success("Product added successfully");
    } else {
      setIsLoading(false);
      if (data.message === "Please authenticate with correct credentials") {
        alert.error(data.message);
        localStorage.removeItem("auth-token");
        router.replace("/login");
      } else {
        alert.error("Adding product unsuccessful");
      }

      return;
    }

    // Reset form fields after adding
    setName("");
    setPrice("");
    setQuantity("");
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Spinner />}
      <div className="flex justify-start mt-5 mb-3 text-xl font-semibold">
        Add a Product
      </div>

      <form onSubmit={handleSubmit} className="mt-4 text-left">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
