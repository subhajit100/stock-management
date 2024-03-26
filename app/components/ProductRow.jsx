import React, { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid"; // Import icons from Heroicons React library

const ProductRow = ({ product, handleDeleteClick, handleEditClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <tr
      key={product._id}
      className="group hover:bg-gray-50 relative"
      onMouseEnter={() => setHoveredIndex(product._id)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <td className="py-2 px-4 border border-gray-300">{product.name}</td>
      <td className="py-2 px-4 border border-gray-300">{product.price}</td>
      <td className="py-2 px-4 border border-gray-300">{product.quantity}</td>
      {hoveredIndex === product._id && (
        <td className="absolute right-0 top-0 flex items-center h-full">
          <button onClick={() => handleDeleteClick(product._id, product.name)}>
            <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer" />
          </button>
          <button onClick={() => handleEditClick(product._id)} className="ml-2">
            <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" />
          </button>
        </td>
      )}
    </tr>
  );
};

export default ProductRow;
