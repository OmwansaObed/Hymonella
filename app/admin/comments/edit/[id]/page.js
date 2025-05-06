"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Sidebar from "@/components/home/admin/SideBar";
import toast from "react-hot-toast";
import { updateComment } from "@/lib/api/comment";

const EditCommentPage = () => {
  const router = useRouter();
  const { id: commentId } = useParams();

  const [comment, setComment] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComment = async () => {
      if (!commentId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/comments?commentId=${commentId}`
        );
        const commentData = response.data?.comments;

        if (commentData) {
          setComment(commentData[0]);

          setContent(commentData[0].content || "Could not find comment.");
        } else {
          setError("Comment not found.");
        }
      } catch (err) {
        console.error("Error fetching comment:", err);
        setError("Failed to load comment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Comment content cannot be empty");
      return;
    }

    try {
      setSaving(true);
      await updateComment(commentId, content);
      toast.success("Comment updated successfully");
      router.push("/admin/comments");
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error(
        `Failed to update comment: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/comments"
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Comments
        </Link>

        <h1 className="text-3xl font-serif font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
          Edit Comment
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
          </div>
        ) : comment ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800">
                Comment by {console.log("comment", comment[0])}
                <span className="text-indigo-600">{comment?.userName}</span>
              </h2>
              <p className="text-sm text-gray-500">
                Posted on {formatDate(comment.createdAt)}
              </p>

              {comment.hymnId && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    Comment on:{" "}
                    <Link
                      href={`/hymns/${comment.hymnId}`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {comment.hymnTitle || `Hymn #${comment.hymnId}`}
                    </Link>
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="content"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Comment Content
              </label>
              <textarea
                id="content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
                required
              ></textarea>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin/comments"
                  className="px-4 py-2 border text-black border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Comment not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCommentPage;
