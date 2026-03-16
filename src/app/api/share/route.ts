import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { QRConfig } from "@/types/qr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, palette } = body as {
      config: QRConfig;
      palette: string[];
    };

    if (!config) {
      return NextResponse.json(
        { error: "Missing config in request body" },
        { status: 400 }
      );
    }

    const id = nanoid(10);

    const { error } = await supabase.from("shared_qrs").insert({
      id,
      config: { ...config, palette },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save QR configuration" },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (request.headers.get("origin") ?? "http://localhost:3000");

    return NextResponse.json({
      id,
      url: `/s/${id}`,
      fullUrl: `${baseUrl}/s/${id}`,
    });
  } catch (err) {
    console.error("Share API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
