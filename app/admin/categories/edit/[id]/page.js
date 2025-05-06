"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { BarLoader, SyncLoader } from "react-spinners";

const EditCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/categories/${params.id}`);
        setName(response.data.name);
      } catch (err) {
        setError("Failed to load category");
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/categories/${params.id}`, { name });
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-gray-700 mb-2 font-medium"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter category name"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                {loading ? (
                  <SyncLoader color="#fff" h={4} w={4} loading={loading} />
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
