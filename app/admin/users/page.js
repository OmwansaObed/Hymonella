"use client";
import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Link from "next/link";
import Sidebar from "@/components/home/admin/SideBar";
import toast from "react-hot-toast";

const DeleteConfirmationModal = ({
  isOpen,
  user,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="mb-4">
            Are you sure you want to delete user{" "}
            <span className="font-semibold">{user?.name}</span> ({user?.email})?
          </p>
          <p className="text-red-600 mb-6">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size={4} className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users");
      setUsers(response.data?.users || []);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/users?id=${userToDelete._id}`);
      toast.success(`User ${userToDelete.name} deleted successfully`);
      await fetchUsers();
    } catch (err) {
      toast.error(
        `Failed to delete user: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            User Management
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/admin/users/add"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            Add New User
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold mb-4 text-gray-800">
            All Users
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner />
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No users found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-black">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50 text-gray-700"
                    >
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isAdmin
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="p-4 flex justify-end space-x-2">
                        <Link
                          href={`/admin/users/edit/${user._id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete User"
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

      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        user={userToDelete}
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UserAdmin;
