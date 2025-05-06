import mongoose from "mongoose";

// Comment schema
const commentSchema = new mongoose.Schema(
  {
    hymnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hymn",
      required: true,
    },
    content: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

// Rating schema
const ratingSchema = new mongoose.Schema(
  {
    hymnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hymn",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Favorite schema
const favoriteSchema = new mongoose.Schema(
  {
    hymnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hymn",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (userId) {
          // Skip password validation by just checking if ID exists
          const user = await mongoose.model("User").exists({ _id: userId });
          return user;
        },
        message: "User does not exist",
      },
    },
  },
  { timestamps: true }
);
favoriteSchema.pre("save", function (next) {
  this.$ignore("createdBy"); // Tell Mongoose to skip validation
  next();
});
export const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    image: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hymn" }],
    comments: [commentSchema],
    ratings: [ratingSchema],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
