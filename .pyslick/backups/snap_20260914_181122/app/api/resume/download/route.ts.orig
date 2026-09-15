import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { readFile } from "fs/promises";
import { join } from "path";

const redis = Redis.fromEnv();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const DEFAULT_RESUME_PATH = "public/resume/lawrence-cortes-resume.pdf";
const CACHE_KEY = "resume_pdf_url";
const CACHE_TTL = 3600;

export async function GET() {
  try {
    let pdfUrl: string | null = await redis.get<string>(CACHE_KEY);

    if (!pdfUrl && SUPABASE_URL && SUPABASE_ANON_KEY) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/portfolio_settings?key=eq.resume_url&select=value`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          next: { revalidate: 0 },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].value) {
          pdfUrl = data[0].value;
          await redis.set(CACHE_KEY, pdfUrl, { ex: CACHE_TTL });
        }
      }
    }

    if (pdfUrl) {
      const pdfRes = await fetch(pdfUrl);
      if (pdfRes.ok) {
        const blob = await pdfRes.blob();
        return new NextResponse(blob, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="Lawrence-Cortes-Resume.pdf"',
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    const filePath = join(process.cwd(), DEFAULT_RESUME_PATH);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Lawrence-Cortes-Resume.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Resume download error:", err);
    return NextResponse.json({ error: "Failed to load resume" }, { status: 500 });
  }
}
