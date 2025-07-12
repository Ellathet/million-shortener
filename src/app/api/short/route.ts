import { NextRequest, NextResponse } from "next/server";
import { ShortedUrlEntity } from "@/models/ShortedUrl";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const urlShorted = new ShortedUrlEntity({
      originalUrl: body.url,
    });

    await urlShorted.save();

    return NextResponse.json({
      id: urlShorted.id,
      originalUrl: urlShorted.originalUrl,
      createdAt: urlShorted.createdAt,
      expiredAt: urlShorted.expiredAt,
      url: request.nextUrl.origin + '/' + urlShorted.id,
    }, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if(error instanceof Error) {
      return NextResponse.json({
        error: error.message || "Invalid data",
      }, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  }
}