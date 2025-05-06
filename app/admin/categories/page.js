"use client";
import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Link from "next/link";
import Sidebar from "@/components/home/admin/SideBar";

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/categories");
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Category Management
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/admin/categories/add"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            Add New Category
          </Link>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold mb-4 text-gray-800">
            All Categories
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner />
              <p className="mt-4 text-indigo-600 font-medium animate-pulse">
                Loading categories...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No categories found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-black">
                    <th className="p-4 text-left">Category Name</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b hover:bg-gray-50 text-gray-700"
                    >
                      <td className="p-4">{category.name}</td>
                      <td className="p-4 flex justify-end space-x-2">
                        <Link
                          href={`/admin/categories/edit/${category._id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this category?"
                              )
                            ) {
                              axios
                                .delete(`/api/categories/${category._id}`)
                                .then(() => fetchCategories())
                                .catch((err) =>
                                  setError("Failed to delete category")
                                );
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAdmin;
