// app/api/contact/route.js
import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import NewsLetter from "@/models/newsletter.modal";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existing = await NewsLetter.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already subscribed" },
        { status: 409 }
      );
    }

    const newEmail = await NewsLetter.create({ email });
    return NextResponse.json({ success: true, email: newEmail });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Only Admins can view this" },
        { status: 401 }
      );
    }

    await connectDB();
    const emails = await NewsLetter.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, emails });
  } catch (err) {
    console.error("Error fetching Emails:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
