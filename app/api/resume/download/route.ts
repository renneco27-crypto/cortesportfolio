import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const DEFAULT_RESUME_PATH = "public/resume/lawrence-cortes-resume.pdf";

export async function GET() {
  try {
    let pdfUrl: string | null = null;

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
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
            "Cache-Control": "no-cache",
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
      },
    });
  } catch (err) {
    console.error("Resume download error:", err);
    return NextResponse.json({ error: "Failed to load resume" }, { status: 500 });
  }
}
