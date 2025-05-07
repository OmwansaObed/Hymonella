import mongoose from "mongoose";

const NewsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsLetter =
  mongoose.models.NewsLetter || mongoose.model("NewsLetter", NewsLetterSchema);

export default NewsLetter;
