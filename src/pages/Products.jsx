// pages/Products.jsx
import React, { useState, useEffect } from 'react';
import Tabs from './productdetail/Tabs';
import FilterBar from './productdetail/Filter';
import ProductTable from './productdetail/ProductTable';
import Pagination from './productdetail/Pagination';
import ProductModal from './productdetail/ProductModal';
import data from '../Data/Products.json';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setProducts(data);
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add Product</button>
      </div>

      <Tabs />
      <FilterBar search={search} setSearch={setSearch} />
      <ProductTable products={currentItems} />
      <Pagination totalItems={filtered.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {showModal && <ProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Products;