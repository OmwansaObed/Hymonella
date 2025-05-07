import mongoose from "mongoose";

const NewsLetterSchema = new mongoose.Schema({
  email: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsLetter =
  mongoose.models.NewsLetter || mongoose.model("Contact", NewsLetterSchema);

export default NewsLetter;
