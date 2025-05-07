// app/api/contact/route.js
import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import NewsLetter from "@/models/newsletter.model";

export async function POST(req) {
  try {
    await connectDB(); // Connect to DB
    const body = await req.json();
    const { email } = body;

    // check existng
    const existingEmail = await NewsLetter.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }
    const newEmail = await NewsLetter.create({ email });
    return NextResponse.json({ success: true, newEmail });
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

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: "you have to login first to see all emails" },
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
