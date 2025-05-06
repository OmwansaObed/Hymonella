"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user with ID:", id);
        const res = await axios.get(`/api/users?id=${id}`);
        const userData = res.data;

        setName(userData?.user.name || "");
        setEmail(userData?.user.email || "");
        setIsAdmin(userData?.user.isAdmin || false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data");
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSubmitting(true);

    try {
      const updatedData = {
        name,
        isAdmin,
      };

      await axios.put(`/api/users?id=${id}`, updatedData);

      toast.success("User updated successfully");
      router.push("/admin/users");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update user";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Users
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-gray-700 mb-2 font-medium"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter full name"
              />
            </div>

            {/* Email - Read Only */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2 font-medium"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Admin Checkbox */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-gray-700">
                Admin User
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-70"
              >
                {submitting ? (
                  "Updating..."
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update User
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

export default EditUserPage;
