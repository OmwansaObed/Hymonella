// /app/api/comments/route.js

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import { Comment } from "@/models/user.model";
import User from "@/models/user.model";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Login to trace your comments" },
        { status: 401 }
      );
    }

    const { hymnId, content } = await request.json();

    if (!hymnId || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    const comment = await Comment.create({
      hymnId,
      content,
      createdBy: user._id,
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const hymnId = url.searchParams.get("hymnId");

    let comments;

    if (hymnId) {
      // Validate hymnId
      if (!mongoose.Types.ObjectId.isValid(hymnId)) {
        return NextResponse.json(
          { message: "Invalid comment hymn ID" },
          { status: 400 }
        );
      }

      // Fetch comments for a specific hymn
      comments = await Comment.find({ hymnId })
        .populate("createdBy", "name image")
        .sort({ createdAt: -1 });

      const formatted = comments.map((c) => ({
        _id: c._id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
          _id: c.createdBy._id,
          name: c.createdBy.name,
          image: c.createdBy.image,
        },
      }));

      return NextResponse.json({ comments: formatted }, { status: 200 });
    } else {
      // Fetch all comments (admin or global view)
      comments = await Comment.find({})
        .populate("createdBy", "name")
        .populate("hymnId", "title")
        .sort({ createdAt: -1 });

      const formatted = comments.map((c) => ({
        _id: c._id,
        content: c.content,
        createdAt: c.createdAt,
        hymnId: c.hymnId._id,
        hymnTitle: c.hymnId.title,
        userName: c.createdBy?.name || "Unknown",
      }));

      return NextResponse.json({ comments: formatted }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the commentId from the query parameters
    const url = new URL(request.url);
    const commentId = url.searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { message: "Comment ID is required" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);

    if (!comment || comment.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Comment not found or not authorized" },
        { status: 403 }
      );
    }

    await comment.deleteOne();

    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    const { content } = await request.json();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const commentId = url.searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { message: "Comment ID is required" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = comment.createdBy.toString() === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: "Not authorized to update this comment" },
        { status: 403 }
      );
    }

    comment.content = content;
    await comment.save();

    return NextResponse.json(
      { message: "Comment updated", comment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
