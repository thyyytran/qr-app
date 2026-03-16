import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { QRConfig } from "@/types/qr";
import SharedQRView from "@/components/SharedQRView";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getSharedQR(id: string): Promise<QRConfig | null> {
  try {
    const { data, error } = await supabase
      .from("shared_qrs")
      .select("config")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data.config as QRConfig;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const config = await getSharedQR(id);

  if (!config) {
    return { title: "QR Code Not Found — QRcraft" };
  }

  return {
    title: `QR Code for ${config.data} — QRcraft`,
    description: `Scan this styled QR code to visit ${config.data}. Created with QRcraft.`,
  };
}

export default async function SharedQRPage({ params }: PageProps) {
  const { id } = await params;
  const config = await getSharedQR(id);

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-10 border border-white/5 flex flex-col items-center gap-5 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-8 h-8 text-white/30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            QR code not found
          </h1>
          <p className="text-white/40 text-sm">
            This shared QR code does not exist or may have been removed.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-primary text-white shadow-glow hover-lift transition-all"
          >
            Create a new QR code
          </Link>
        </div>
      </div>
    );
  }

  return <SharedQRView config={config} />;
}
