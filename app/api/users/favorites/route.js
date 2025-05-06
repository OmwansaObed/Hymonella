import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/route";

// POST - Add a hymn to favorites
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { hymnId } = await request.json();

    if (!hymnId) {
      return NextResponse.json(
        { message: "Hymn ID is required in the backend" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // // Check if hymn is already in favorites
    const alreadyFavorited = user.favorites.some(
      (favId) => favId.toString() === hymnId
    );

    if (alreadyFavorited) {
      return NextResponse.json(
        { message: "Hymn is already in favorites" },
        { status: 409 }
      );
    }

    // Add to favorites
    user.favorites.push(new mongoose.Types.ObjectId(hymnId));
    await user.save();

    return NextResponse.json(
      {
        message: "Added to favorites successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a hymn from favorites
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const hymnId = url.searchParams.get("hymnId");

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

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== hymnId
    );

    await user.save();

    return NextResponse.json(
      {
        message: "Removed from favorites successfully",
      },
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

// GET - Handles multiple favorite-related queries
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const checkHymn = url.searchParams.get("checkHymn");
    const globalCount = url.searchParams.get("globalCount");
    const popular = url.searchParams.get("popular");

    // 🌐 1. Return global count of all favorites
    if (globalCount === "true") {
      const totalFavorites = await User.aggregate([
        { $project: { favorites: 1 } },
        { $unwind: "$favorites" },
        { $count: "count" },
      ]);
      const count = totalFavorites[0]?.count || 0;
      return NextResponse.json({ count }, { status: 200 });
    }

    // 🌟 2. Return most popular hymn
    if (popular === "true") {
      const mostPopular = await User.aggregate([
        { $unwind: "$favorites" },
        { $group: { _id: "$favorites", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "hymns", // 🔁 Adjust if collection name differs
            localField: "_id",
            foreignField: "_id",
            as: "hymn",
          },
        },
        { $unwind: "$hymn" },
        {
          $project: {
            _id: 0,
            hymnId: "$_id",
            title: "$hymn.title",
            author: "$hymn.author",
            count: 1,
          },
        },
      ]);

      return NextResponse.json(
        { mostPopular: mostPopular[0] || null },
        { status: 200 }
      );
    }

    // 🔐 3. Check for authenticated session
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized ther is no session" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email })
      .populate("favorites", "title author _id")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ 4. If "checkHymn" param, check if user has favorited it
    if (checkHymn) {
      const isFavorited = user.favorites.some(
        (hymn) => hymn._id.toString() === checkHymn
      );
      return NextResponse.json({ isFavorited }, { status: 200 });
    }

    // 🎵 5. Default: return all user favorites
    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
