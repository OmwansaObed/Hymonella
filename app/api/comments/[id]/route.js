// /app/api/comments/[commentId]/route.js

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Comment } from "@/models/user.model";

export async function DELETE(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await context.params;
    console.log("commentId", commentId);
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Allow if the user is the owner or an admin
    const isOwner = comment.createdBy.toString() === session.user.id;
    const isAdmin = session.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Not authorized to delete this comment" },
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

export async function PUT(request, context) {
  try {
    const session = await getServerSession(authOptions);
    const { content } = await request.json();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await context.params;
    const comment = await Comment.findById(commentId);

    if (!comment || comment.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Comment not found or not authorized" },
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
