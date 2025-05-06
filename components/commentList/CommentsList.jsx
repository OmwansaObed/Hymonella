// components/CommentsList.jsx
"use client";

import { useEffect, useState } from "react";
import { fetchComments, deleteComment, updateComment } from "@/lib/api/comment";
import CommentForm from "./CommentForm";
import {
  MessageCircle,
  User,
  Clock,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CommentsList({ hymnId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    loadComments();
  }, [hymnId]);

  const loadComments = () => {
    setLoading(true);
    fetchComments(hymnId)
      .then((data) => setComments(data.comments))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleNewComment = (comment) => {
    setComments((prev) => [comment, ...prev]);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(response.data.message || "Failed to delete comment");
    }
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleUpdateComment = (updatedComment) => {
    setComments(
      comments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
    setEditingCommentId(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-4 text-indigo-600">
        <div className="w-6 h-6 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span className="font-medium text-sm">Loading comments...</span>
      </div>
    );

  return (
    <div className="mt-4 md:mt-8 space-y-4 md:space-y-6 px-3 sm:px-6 md:px-10">
      <div className="mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 flex items-center">
          <MessageCircle size={20} className="inline mr-2 text-indigo-500" />
          Community Reflections
        </h3>
        <div className="h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded"></div>
      </div>

      <CommentForm hymnId={hymnId} onCommentAdded={handleNewComment} />

      <div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 flex items-center">
          All Comments
        </h2>
      </div>

      <div className="space-y-4 mt-4 md:mt-8">
        {comments.length === 0 ? (
          <div className="bg-white bg-opacity-80 p-4 md:p-6 rounded-xl shadow-sm text-center border-l-4 border-indigo-300">
            <p className="text-gray-600 italic text-sm md:text-base">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-sm p-3 md:p-5 border-l-4 border-indigo-200 hover:shadow-md transition-all relative"
            >
              {editingCommentId === comment._id ? (
                <CommentForm
                  hymnId={hymnId}
                  commentToEdit={comment}
                  onCommentAdded={handleUpdateComment}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 md:mb-3">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="bg-gradient-to-br rounded-full mr-2">
                        {comment.user?.image ? (
                          <img
                            src={comment.user.image}
                            alt={comment.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <User size={16} className="text-indigo-500" />
                        )}
                      </div>
                      <span className="font-bold text-gray-800 ml-1 text-sm md:text-base">
                        {comment.user?.name || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        <time className="text-xs truncate max-w-[120px] sm:max-w-full">
                          {new Date(comment.createdAt).toLocaleString()}
                        </time>
                      </div>
                      {session?.user?.id === comment.user?._id && (
                        <div className="flex space-x-2 ml-2 sm:ml-3">
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pl-2 sm:pl-8 md:pl-10 text-gray-700 text-sm md:text-base break-words">
                    {comment.content}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
