import React, { useState, useEffect } from "react";

const initialProduct = {
  image: null,
  title: "",
  category: "",
  description: "",
  date: "",
  price: 0,
  gender: "",
  sizes: ["", "", ""],
};

const NewProduct = () => {
  const [product, setProduct] = useState(initialProduct);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product.image) {
      const objectUrl = URL.createObjectURL(product.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [product.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSizeChange = (e) => {
    const sizes = e.target.value.split(",").map((s) => s.trim());
    setProduct((prev) => ({ ...prev, sizes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product:", product);
    // TODO: API PUT/PATCH call
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-gray-700">
      <h2 className="text-2xl font-semibold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium">Upload Image</label>
          <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center">
            <input type="file" onChange={handleImageChange} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer text-blue-600">Drag & Drop or Browse</label>
            {preview && <img src={preview} alt="Preview" className="mt-4 w-32 h-32 object-cover mx-auto" />}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />
          <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="All">All Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded"
            placeholder="Description..."
          />
          <div className="flex gap-4">
            <input
              type="date"
              name="date"
              value={product.date}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              className="p-2 border rounded w-full"
            />
          </div>
          <select name="gender" value={product.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option>-- Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
          <input
            type="text"
            placeholder="Sizes (comma separated)"
            value={product.sizes.join(", ")}
            onChange={handleSizeChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-4">
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
              Save Product
            </button>
            <button type="reset" className="border border-purple-600 text-purple-600 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
