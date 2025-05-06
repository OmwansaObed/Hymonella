import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get("url");

  if (!audioUrl) {
    return new NextResponse('Missing "url" query parameter', { status: 400 });
  }

  try {
    const response = await fetch(audioUrl); // ✅ Removed `mode: "no-cors"`

    if (!response.ok) {
      return new NextResponse("Failed to fetch audio", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error proxying audio:", error);
    return new NextResponse("Failed to fetch audio", { status: 500 });
  }
}
