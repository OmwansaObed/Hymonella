import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Favorite } from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { hymnId } = await req.json();

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      hymnId,
      createdBy: session.user.id,
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Hymn already in favorites" },
        { status: 400 }
      );
    }

    // Create new favorite
    const favorite = await Favorite.create({
      hymnId,
      createdBy: session.user.id,
    });

    return NextResponse.json(
      { message: "Added to favorites", favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { hymnId } = await req.json();

    const result = await Favorite.findOneAndDelete({
      hymnId,
      createdBy: session.user.id,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Removed from favorites" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
