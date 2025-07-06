// components/FilterBar.jsx
import React from "react";

const FilterBar = ({ search, setSearch }) => (
  <div className="flex flex-wrap justify-between gap-4 mb-6">
    {/* <div className="flex gap-4">
      <select className="p-2 border rounded bg-white">
        <option>All Category</option>
        <option>Footwear</option>
        <option>Electronics</option>
        <option>Fashion</option>
      </select>
      <select className="p-2 border rounded bg-white">
        <option>Vendor</option>
        <option>Vendor A</option>
        <option>Vendor B</option>
      </select>
    </div> */}
    <input
      type="text"
      className="p-2 border rounded w-64"
      placeholder="Search"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  </div>
);
export default FilterBar;
