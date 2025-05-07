"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit, MessageCircle } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Link from "next/link";
import Sidebar from "@/components/home/admin/SideBar";
import toast from "react-hot-toast";
import { deleteComment } from "@/lib/api/comment";

// Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  comment,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50  shadow-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            Confirm Deletion
          </h3>
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete this comment by{" "}
            <span className="font-semibold">{comment?.userName}</span>?
          </p>
          <div className="p-3 bg-gray-50 rounded-md mb-4 text-gray-600 text-sm">
            <p className="italic">{comment?.content}</p>
          </div>
          <p className="text-red-600 mb-6">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              disabled={isDeleting}
            >
              {isDeleting ? <>Deleting...</> : "Delete Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CommentsAdmin = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments`);

      setComments(response.data?.comments || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setComments([]);
      setError(err.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteComment(commentToDelete._id);
      toast.success("Comment deleted successfully");
      await fetchComments();
    } catch (err) {
      toast.error(
        `Failed to delete comment: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <Sidebar />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Comments Management
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end mb-6">
          <Link
            href="/admin/comments/settings"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <MessageCircle size={18} className="mr-2" />
            Comment Settings
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold mb-4 text-gray-800">
              All Comments
            </h2>
            <p className="text-sm text-gray-600">
              {comments.length} comment{comments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner />
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No comments found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-black">
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Comment</th>
                    <th className="p-4 text-left">Hymn</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr
                      key={comment._id}
                      className="border-b hover:bg-gray-50 text-gray-700"
                    >
                      <td className="p-4 font-medium">{comment.userName}</td>
                      <td className="p-4">
                        <div className="max-w-xs truncate">
                          {comment.content}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/hymns/${comment.hymnId}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {comment.hymnTitle || `Hymn #${comment.hymnId}`}
                        </Link>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="p-4 flex justify-end space-x-2">
                        <Link
                          href={`/admin/comments/edit/${comment._id}`}
                          className="py-2 text-indigo-600 hover:bg-indigo-50 rounded-md pr-2"
                          title="Edit Comment"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setCommentToDelete(comment)}
                          className="py-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete Comment"
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
        isOpen={!!commentToDelete}
        comment={commentToDelete}
        onConfirm={handleDelete}
        onCancel={() => setCommentToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CommentsAdmin;
