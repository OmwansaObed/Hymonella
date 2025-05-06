import mongoose from "mongoose";
import Category from "./category.model";

const hymnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Hymn title is required"],
      trim: true,
      index: true,
    },
    lyrics: {
      type: String,
      required: [true, "Lyrics are required"],
      trim: true,
    },
    author: {
      type: String,
      default: "Unknown",
      trim: true,
      maxlength: [50, "Author name cannot exceed 50 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    imageUrl: {
      type: [String],
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          // Added cloud storage pattern matching
          return /(\.(mp3|wav|ogg|m4a)$)|(^https?:\/\/)/i.test(v);
        },
        message: (props) => `Audio file must be a valid audio format or URL`,
      },
    },
    hymnNumber: {
      type: Number,
      unique: true,
      min: [1, "Hymn number must be at least 1"],
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [20, "Tag cannot exceed 20 characters"],
      },
    ],
    duration: {
      type: Number,
      min: [0, "Duration cannot be negative"],
      set: (v) => Math.round(v), // Ensure whole numbers
    },

    language: {
      type: String,
      default: "English",
      trim: true,
      maxlength: [30, "Language name too long"],
    },
    history: {
      type: String,
      trim: true,
      required: true,
    },

    // For favorites tracking
    favoritesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v; // Remove version key
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v; // Remove version key
        return ret;
      },
    },
  }
);

// Text index for search (already present in your version)
hymnSchema.index({
  title: "text",
  lyrics: "text",
  author: "text",
  tags: "text",
});

// Virtual for formatted duration (mm:ss)
hymnSchema.virtual("durationFormatted").get(function () {
  if (!this.duration) return null;
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Pre-save hook to maintain data consistency
hymnSchema.pre("save", function (next) {
  // Ensure tags are unique
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags)];
  }

  // Increment version on updates
  if (this.isModified()) {
    this.version += 1;
  }

  next();
});

const Hymn = mongoose.models.Hymn || mongoose.model("Hymn", hymnSchema);

export default Hymn;
