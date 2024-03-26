"use client";
import React, { useState } from "react";
import EditProductModal from "./EditProductModal";
import ProductRow from "./ProductRow";
import Spinner from "./Spinner";
import { useAlert } from "react-alert";

const ProductTable = ({ products, setProducts }) => {
  const [editProductId, setEditProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();

  const handleDeleteClick = async (id, productName) => {
    let consent = confirm(
      "Are you sure you want to delete the product: " + productName
    );
    if (!consent) {
      return;
    }
    setIsLoading(true);
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data.success) {
      // also make changes in frontend state
      const newProducts = products.filter((product) => product._id !== id);
      setProducts(newProducts);
      alert.success("Product deleted successfully");
    } else {
      alert.error("Deleting product unsuccessful");
    }
    setIsLoading(false);
  };

  const handleEditClick = (id) => {
    setEditProductId(id);
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
  };

  const handleSaveEdit = async (updatedProduct) => {
    setEditProductId(null);
    const { name, price, quantity } = updatedProduct;
    setIsLoading(true);
    // make an api call updating the product in the backend db
    const res = await fetch(`/api/products/${updatedProduct._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, quantity }),
    });
    const data = await res.json();

    if (data.success) {
      // update the product in the frontend as well
      const updatedProducts = products.map((product) => {
        if (product._id === updatedProduct._id) {
          return data.product;
        }
        return product;
      });

      setProducts(updatedProducts);
      alert.success("Product updated successfully");
    } else {
      alert.error("Updating product unsuccessful");
    }
    setIsLoading(false);
  };

  return (
    <div className={`mb-10 relative`}>
      {isLoading && <Spinner />}
      {/* Blur effect for background content */}
      {editProductId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg"></div>
      )}
      <div className="flex justify-start mt-5 mb-3 text-xl font-semibold">
        Display current stocks
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border border-gray-300">Name</th>
            <th className="py-2 px-4 border border-gray-300">Price</th>
            <th className="py-2 px-4 border border-gray-300">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick}
            />
          ))}
        </tbody>
      </table>
      {/* Render the edit product modal */}
      {editProductId !== null && (
        <EditProductModal
          product={products.find((product) => product._id === editProductId)}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default ProductTable;
