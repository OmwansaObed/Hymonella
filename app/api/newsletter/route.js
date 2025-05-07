// app/api/contact/route.js
import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import NewsLetter from "@/models/newsletter.modal";

export async function POST(req) {
  try {
    await connectDB(); // Connect to DB
    const body = await req.json();
    const { email } = body;

    const newContact = await NewsLetter.create({ email });
    ``;
    return NextResponse.json({ success: true, contact: newContact });
  } catch (err) {
    console.error(err);
    return NextResponse(
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
        { message: "Only Admins can view this" },
        { status: 401 }
      );
    }

    await connectDB();

    const contacts = await NewsLetter.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, contacts });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
