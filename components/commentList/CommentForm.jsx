"use client";

import { useState } from "react";
import { postComment } from "@/lib/api/comment";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function CommentForm({ hymnId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const res = await postComment({ hymnId, content });
      onCommentAdded(res.comment);
      setContent("");
      toast.success("Comment posted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login to trace your comments"
      );
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 rounded-xl shadow-sm p-5 border-l-4 border-purple-300"
    >
      <textarea
        placeholder="Share your thoughts on this hymn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-4 text-black border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition-all resize-none min-h-32 bg-white bg-opacity-80"
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Posting...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Share Comment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
