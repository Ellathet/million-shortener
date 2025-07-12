import { NextRequest, NextResponse } from "next/server";
import { ShortedUrlEntity } from "@/models/ShortedUrl";
import { RecaptchaService } from "../../../lib/recaptcha";
import { HttpStatusCode } from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const recaptcha = new RecaptchaService();

    if(process.env.NODE_ENV === 'production') {
      if (!body.token) {
        return NextResponse.json({
          error: 'Captcha Token is required',
        }, {
          status: HttpStatusCode.Unauthorized,
        })
      }
  
      const recaptchaData = await recaptcha.verify(body.token);

      if (recaptchaData.success === false) {
        return NextResponse.json({
          error: 'Captcha verification failed',
        }, {
          status: HttpStatusCode.Unauthorized,
        })
      }
    }

    const urlShorted = new ShortedUrlEntity({
      originalUrl: body.url,
    });

    await urlShorted.save();

    return NextResponse.json({
      id: urlShorted.id,
      originalUrl: urlShorted.originalUrl,
      createdAt: urlShorted.createdAt,
      expiredAt: urlShorted.expiredAt,
      // Gen Url only in response to avoid domain changes
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

    return NextResponse.json({
      error: "An unexpected error occurred",
    }, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}