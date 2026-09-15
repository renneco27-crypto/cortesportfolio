import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

const DEFAULT_RESUME = "/resume/lawrence-cortes-resume.pdf";

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ url: DEFAULT_RESUME });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_settings?key=eq.resume_url&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 0 }, // Do not cache this, fetch fresh to get updates
      }
    );

    if (!res.ok) {
      console.warn(`Supabase settings fetch failed: ${res.status}`);
      return NextResponse.json({ url: DEFAULT_RESUME });
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].value) {
      return NextResponse.json({ url: data[0].value });
    }

    return NextResponse.json({ url: DEFAULT_RESUME });
  } catch (err) {
    console.error("Failed to fetch resume URL from database:", err);
    return NextResponse.json({ url: DEFAULT_RESUME });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured on the server." },
        { status: 500 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateKey = `admin_login_${ip}`;
    const attempts = await redis.get<number>(rateKey) ?? 0;

    if (attempts > 0) {
      const blockSeconds = 20 + (attempts - 1) * 10;
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${blockSeconds} seconds.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const password = formData.get("password") as string;
    const file = formData.get("file") as File | null;

    if (password !== ADMIN_PASSWORD) {
      const newAttempts = attempts + 1;
      const blockSeconds = 20 + (newAttempts - 1) * 10;
      await redis.set(rateKey, newAttempts, { ex: blockSeconds });
      return NextResponse.json({ error: "Unauthorized: Invalid password" }, { status: 401 });
    }

    await redis.del(rateKey);

    if (!file) {
      return NextResponse.json({ error: "Bad Request: No file provided" }, { status: 400 });
    }

    if (!SUPABASE_URL || (!SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_ANON_KEY)) {
      return NextResponse.json(
        { error: "Supabase connection is not configured." },
        { status: 500 }
      );
    }

    const token = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
    const filename = `resume-${Date.now()}.pdf`;

    // Upload file to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/resumes/${filename}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: token,
          "Content-Type": file.type || "application/pdf",
          "x-upsert": "true",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Storage upload failed: ${uploadRes.status} - ${errorText}`);
    }

    // Public URL of the uploaded resume
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/resumes/${filename}`;

    // Upsert the public URL in portfolio_settings
    const dbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_settings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: token,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          key: "resume_url",
          value: publicUrl,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!dbRes.ok) {
      const dbError = await dbRes.text();
      throw new Error(`Database settings upsert failed: ${dbRes.status} - ${dbError}`);
    }

    await redis.del("resume_pdf_url");

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("Resume upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload resume" },
      { status: 500 }
    );
  }
}
