// components/ProductRow.jsx
import { FaEdit, FaTrash } from 'react-icons/fa';
import React from "react";

const ProductRow = ({ product }) => {
  return (
    <tr className="border-b ">
      <td className="p-4 flex  gap-3">
        <img src={product.image} alt="" className="w-18 h-18 object-cover rounded" />
        <div>
          <div className="font-medium">{product.title}</div>
          <div className="text-xs text-gray-500">{product.subtitle}</div>
        </div>
      </td>
      <td className="text-blue-500 underline">{product.categories.join(', ')}</td>
      <td>
        <span className={`px-2 py-1 rounded text-xs font-medium ${product.status === 'In stock' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {product.status}
        </span>
      </td>
      {/* <td>
        <div className="flex gap-1">{product.colors.map(c => <span key={c} className={`w-4 h-4 rounded-full inline-block`} style={{ backgroundColor: c }} />)}</div>
        <div className="text-xs">Size: {product.sizes.join(', ')}</div>
      </td> */}
      <td>
        <div className="font-bold text-gray-800">${product.price}</div>
        <div className="line-through text-xs text-gray-400">${product.oldPrice}</div>
      </td>
      <td>{product.date}</td>
      <td className="flex gap-2 px-2">
        <FaEdit className="text-blue-600 cursor-pointer" />
        <FaTrash className="text-red-500 cursor-pointer" />
      </td>
    </tr>
  );
};

export default ProductRow;