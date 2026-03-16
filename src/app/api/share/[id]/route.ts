import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("shared_qrs")
      .select("config")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "QR code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ config: data.config });
  } catch (err) {
    console.error("Share GET API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
