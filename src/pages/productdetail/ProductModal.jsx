// components/ProductModal.jsx
const ProductModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <h3 className="text-lg font-semibold mb-4">Add Product</h3>
        {/* Your form goes here */}
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <form className="space-y-4">
          <input type="text" placeholder="Title" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Subtitle" className="w-full border p-2 rounded" />
          <input type="number" placeholder="Price" className="w-full border p-2 rounded" />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded w-full">Save</button>
        </form>
      </div>
    </div>
  );
};
export default ProductModal;