import axios from "axios";

export const fetchComments = async (hymnId) => {
  const res = await axios.get(`/api/comments`, {
    params: { hymnId },
  });
  return res.data;
};

export const postComment = async ({ hymnId, content }) => {
  const res = await axios.post("/api/comments", {
    hymnId,
    content,
  });
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await axios.delete(`/api/comments?commentId=${commentId}`);
  return res.data;
};

export const updateComment = async (commentId, newContent) => {
  const res = await axios.put(`/api/comments?commentId=${commentId}`, {
    content: newContent,
  });
  return res.data;
};
