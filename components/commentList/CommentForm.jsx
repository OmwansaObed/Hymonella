"use client";

import { useState } from "react";
import { postComment } from "@/lib/api/comment";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function CommentForm({
  hymnId,
  onCommentAdded,
  commentToEdit,
  onCancel,
}) {
  const [content, setContent] = useState(commentToEdit?.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      if (commentToEdit) {
        // Handle edit logic (if you implement it)
        // const res = await updateComment(commentToEdit._id, { content });
        // onCommentAdded(res.comment);
      } else {
        const res = await postComment({ hymnId, content });
        onCommentAdded(res.comment);
      }
      setContent("");
      toast.success(
        commentToEdit
          ? "Comment updated successfully"
          : "Comment posted successfully"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login to trace your comments"
      );
      console.error("Error with comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 rounded-xl shadow-sm p-3 sm:p-4 md:p-5 border-l-4 border-purple-300"
    >
      <textarea
        placeholder="Share your thoughts on this hymn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 sm:p-3 md:p-4 text-sm md:text-base text-black border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition-all resize-none min-h-24 md:min-h-32 bg-white bg-opacity-80"
      />
      <div className="flex flex-wrap gap-2 justify-end mt-2 sm:mt-3">
        {commentToEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 text-sm md:text-base rounded-full shadow-sm hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm md:text-base rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <>
              <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm md:text-base">Posting...</span>
            </>
          ) : (
            <>
              <Send size={14} className="mr-1 md:mr-2" />
              <span className="text-sm md:text-base">
                {commentToEdit ? "Update" : "Share Comment"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
