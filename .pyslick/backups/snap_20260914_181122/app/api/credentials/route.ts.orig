import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Safely fetch credentials from Supabase, handling missing config gracefully.
export async function GET() {
  // Ensure Supabase configuration is present
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase configuration missing; returning empty credentials.");
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/credentials?select=*&order=sort_order.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        // Revalidate every minute to keep data fresh
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Credentials API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch credentials" },
      { status: 500 }
    );
  }
}
