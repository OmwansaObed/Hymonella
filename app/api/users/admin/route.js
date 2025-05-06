// File: app/api/users/admin/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

// POST - Set admin status for a user (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if the requesting user is an admin
    const admin = await User.findOne({
      email: session.user.email,
      isAdmin: true,
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required" },
        { status: 403 }
      );
    }

    const { userId, isAdmin: setAdminStatus } = await request.json();

    if (!userId || setAdminStatus === undefined) {
      return NextResponse.json(
        { message: "User ID and admin status are required" },
        { status: 400 }
      );
    }

    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find the user to update
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prevent removing admin status from the last admin
    if (userToUpdate.isAdmin && !setAdminStatus) {
      const adminCount = await User.countDocuments({ isAdmin: true });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot remove admin status from the last admin" },
          { status: 400 }
        );
      }
    }

    // Update the user's admin status
    userToUpdate.isAdmin = setAdminStatus;
    await userToUpdate.save();

    return NextResponse.json(
      {
        message: `Admin status ${
          setAdminStatus ? "granted" : "revoked"
        } successfully`,
        user: {
          _id: userToUpdate._id,
          name: userToUpdate.name,
          email: userToUpdate.email,
          isAdmin: userToUpdate.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating admin status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
