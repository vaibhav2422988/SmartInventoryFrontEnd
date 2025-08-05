import React, { useState, useEffect } from "react";
import apiService from "../apiService";
import { PlusCircle, Trash2, Tag, FileText } from "lucide-react";

const AddCategory = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // 🔥 new state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear previous error
      const newCategory = {
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
      };

      await apiService.addCategory(newCategory);
      setNewCategoryName("");
      setNewCategoryDesc("");
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error adding category:", error);

      // Extract message from backend
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setIsDeleting(id);
      await apiService.deleteCategory(id);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Add New Category */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Tag className="w-4 h-4" />
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter a creative category name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4" />
                    Description
                  </label>
                  <input
                    type="text"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 placeholder-gray-400"
                    placeholder="Describe what this category is about..."
                  />
                </div>
              </div>

              {/* 🔥 Error Message UI */}
              {errorMessage && (
                <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleAddCategory}
                  disabled={isLoading || !newCategoryName.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Your Categories</h3>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {categoriesList.length} {categoriesList.length === 1 ? 'Category' : 'Categories'}
              </div>
            </div>

            {categoriesList.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No categories yet</h4>
                <p className="text-gray-500">Create your first category to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoriesList.map((cat) => (
                  <div
                    key={cat.id}
                    className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                            {cat.name}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {cat.description || "No description provided"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={isDeleting === cat.id}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete category"
                      >
                        {isDeleting === cat.id ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                        ID: {cat.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
