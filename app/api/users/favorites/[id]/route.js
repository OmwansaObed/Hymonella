import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/components/uploadthing/imageUpload";
import User from "@/models/user.model";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const hymnId = params.hymnId;

    if (!hymnId) {
      return NextResponse.json(
        { message: "Hymn ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove the hymn from favorites
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== hymnId
    );
    await user.save();

    return NextResponse.json(
      { message: "Removed from favorites successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
