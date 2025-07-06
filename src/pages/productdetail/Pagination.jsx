// components/Pagination.jsx
import React from "react";

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-center mt-6 gap-2">
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx + 1)}
          className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-white'}`}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
};
export default Pagination;