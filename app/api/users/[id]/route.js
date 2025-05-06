// File: app/api/users/[userId]/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// GET - Get a specific user (admin only or self)
export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = context.params;

    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Get the requesting user
    const requestingUser = await User.findOne({ email: session.user.email });

    if (!requestingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if admin or self
    const isSelf = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.isAdmin;

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized to access this user's data" },
        { status: 403 }
      );
    }

    // Get the requested user
    const user = await User.findById(userId).select("-__v");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If not self and not admin, limit the fields returned
    if (!isSelf && !isAdmin) {
      const limitedUser = {
        _id: user._id,
        name: user.name,
        image: user.image,
      };
      return NextResponse.json({ user: limitedUser }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const body = await request.json();

    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Get the requesting user
    const requestingUser = await User.findOne({ email: session.user.email });

    if (!requestingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if admin or self
    const isSelf = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.isAdmin;

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized to update this user" },
        { status: 403 }
      );
    }

    // Get the user to update
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prepare update fields
    const updateFields = {};

    // Regular users can only update their name and image
    if (isSelf && !isAdmin) {
      if (body.name !== undefined) updateFields.name = body.name;
      if (body.image !== undefined) updateFields.image = body.image;
    }

    // Admins can update additional fields
    if (isAdmin) {
      if (body.name !== undefined) updateFields.name = body.name;
      if (body.image !== undefined) updateFields.image = body.image;
      if (body.isAdmin !== undefined) updateFields.isAdmin = body.isAdmin;
    }

    // Prevent email changes as it's used for authentication
    if (body.email !== undefined && body.email !== userToUpdate.email) {
      return NextResponse.json(
        { message: "Email cannot be changed" },
        { status: 400 }
      );
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-__v");

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only or self)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    console.log("🚀 userId:", userId);
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Get the requesting user
    const requestingUser = await User.findOne({ email: session.user.email });

    if (!requestingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if admin or self
    const isSelf = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.isAdmin;

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized to delete this user" },
        { status: 403 }
      );
    }

    // Get the user to delete
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prevent deleting the last admin
    if (userToDelete.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot delete the last admin user" },
          { status: 400 }
        );
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      {
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
