// ProductDisplay.js
import React from "react";

const SearchedProducts = ({ products, onDecrease, onIncrease }) => {
  return (
    <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-md w-3/4">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex items-center justify-between mb-2"
        >
          <span>{product.name}</span>
          <div className="flex items-center">
            <button onClick={() => onDecrease(product)} className="mr-2">
            <span className="text-red-500 hover:text-red-700 cursor-pointer">-</span>
            </button>
            <span>{product.quantity}</span>
            <button onClick={() => onIncrease(product)} className="ml-2">
            <span className="text-green-500 hover:text-green-700 cursor-pointer">+</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchedProducts;
