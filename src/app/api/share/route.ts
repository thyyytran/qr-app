import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { QRConfig } from "@/types/qr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, palette, customSlug } = body as {
      config: QRConfig;
      palette: string[];
      customSlug?: string;
    };

    if (!config) {
      return NextResponse.json(
        { error: "Missing config in request body" },
        { status: 400 }
      );
    }

    let id: string;

    if (customSlug) {
      // Validate: only URL-safe characters, 3-50 chars
      if (!/^[a-zA-Z0-9_-]{3,50}$/.test(customSlug)) {
        return NextResponse.json(
          { error: "Custom link must be 3–50 characters (letters, numbers, - and _ only)" },
          { status: 400 }
        );
      }

      // Check uniqueness
      const { data: existing } = await supabase
        .from("shared_qrs")
        .select("id")
        .eq("id", customSlug)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "That custom link is already taken — try another" },
          { status: 409 }
        );
      }

      id = customSlug;
    } else {
      id = nanoid(10);
    }

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
