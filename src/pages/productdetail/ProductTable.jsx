// components/ProductTable.jsx
import ProductRow from './ProductRow';
import React from "react";


const ProductTable = ({ products }) => (
  <div className="bg-white shadow rounded">
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase text-gray-600">
        <tr>
          <th className="p-4">Product & Title</th>
          <th>Categories</th>
          <th>Status</th>
          {/* <th>Attributes</th> */}
          <th>Price</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => (
          <ProductRow key={idx} product={product}  />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;