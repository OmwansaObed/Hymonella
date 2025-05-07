// File: app/api/users/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { authOptions } from "@/components/uploadthing/imageUpload";
import connectDB from "@/lib/connectDB";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// GET - Get all users (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Log in first to see all users" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    // If userId is provided, fetch the specific user
    if (userId) {
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
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
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
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
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
    }

    // If no userId is provided, fetch all users (admin only)
    const requestingUser = await User.findOne({
      email: session.user.email,
    }).select("+password");
    if (!requestingUser?.isAdmin) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const users = await User.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // Enhanced validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!password || password.length < 4) {
      return NextResponse.json(
        {
          error: "Password must be at least 4 characters",
        },
        { status: 400 }
      );
    }

    // Check for existing user (both regular and OAuth users)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Check if this is an OAuth user trying to register with credentials
      const userWithPassword = await User.findOne({ email }).select(
        "+password"
      );

      if (!userWithPassword.password) {
        return NextResponse.json(
          {
            error:
              "This email is already registered with a social login. Please sign in with Google.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: "Email already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with password explicitly set
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    // Verify the user was created with a password
    const verifyUser = await User.findById(newUser._id).select("+password");
    if (!verifyUser || !verifyUser.password) {
      console.error("User created but password not saved properly");
      // Clean up the problematic user
      await User.findByIdAndDelete(newUser._id);
      return NextResponse.json(
        {
          error: "Failed to properly create user account",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract userId from the URL
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    console.log("🚀 userId:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID missing in URL" },
        { status: 400 }
      );
    }

    // Check if valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const requestingUser = await User.findOne({ email: session.user.email });

    if (!requestingUser) {
      return NextResponse.json(
        { message: "Requesting user not found" },
        { status: 404 }
      );
    }

    const isSelf = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.isAdmin;

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { message: "Not authorized to delete this user" },
        { status: 403 }
      );
    }

    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prevent deleting the last admin
    if (userToDelete.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot delete the last admin" },
          { status: 400 }
        );
      }
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: "User deleted successfully" },
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

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    console.log("🔧 PUT userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const requestingUser = await User.findOne({ email: session.user.email });
    if (!requestingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isSelf = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.isAdmin;

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized to update this user" },
        { status: 403 }
      );
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateFields = {};
    if (isSelf && !isAdmin) {
      if (body.name !== undefined) updateFields.name = body.name;
      if (body.image !== undefined) updateFields.image = body.image;
    }
    if (isAdmin) {
      if (body.name !== undefined) updateFields.name = body.name;
      if (body.image !== undefined) updateFields.image = body.image;
      if (body.isAdmin !== undefined) updateFields.isAdmin = body.isAdmin;
    }

    if (body.email !== undefined && body.email !== userToUpdate.email) {
      return NextResponse.json(
        { message: "Email cannot be changed" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-__v");

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
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
