import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCategory = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const API_BASE_URL = "https://localhost:7068/api/category";

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("Fetched categories:", response.data);
      setCategoriesList(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const newCategory = {
        name: newCategoryName,
        description: newCategoryDesc,
      };

      await axios.post(API_BASE_URL, newCategory);
      setNewCategoryName("");
      setNewCategoryDesc("");
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h2>
        <form onSubmit={handleAddCategory}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Existing Categories */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesList.map((cat) => (
            <div
              key={cat.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-gray-800">{cat.name}</h4>
                <p className="text-sm text-gray-600">{cat.description}</p>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-600 rounded text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
