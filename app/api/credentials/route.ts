import { NextResponse } from "next/server";
import { certificationsData } from "@/data/certifications";
import type { PortfolioCredential } from "@/types";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nstyqceyjkgevnibfqks.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

const fallbackCredentials: PortfolioCredential[] = [
  {
    id: "csc-professional",
    label: "Civil Service Exam — Professional Level",
    issuing_body: "Civil Service Commission (CSC), Philippines",
    status: "in-progress",
    badge_icon: "award",
    sort_order: 1,
    notes: "Civil service eligibility for government technical roles.",
    verify_url: "https://www.csc.gov.ph",
  },
  {
    id: "tesda-css-nc2",
    label: "Computer Systems Servicing NC II",
    issuing_body: "TESDA",
    status: "in-progress",
    badge_icon: "check",
    sort_order: 2,
    notes: "Hands-on hardware, OS, and networking assessment.",
    verify_url: "https://www.tesda.gov.ph",
  },
  {
    id: "cisco-cybersecurity",
    label: "Intro to Cybersecurity & Networking Basics",
    issuing_body: "Cisco Networking Academy",
    status: "in-progress",
    badge_icon: "shield",
    sort_order: 3,
    notes: "Enterprise network security and threat defense fundamentals.",
    verify_url: "https://www.netacad.com",
  },
  {
    id: "pwncollege-badge",
    label: "pwn.college — Program Security Path",
    issuing_body: "pwn.college",
    status: "pending",
    badge_icon: "shield",
    sort_order: 4,
    notes: "Binary exploitation, reverse engineering, shellcode development.",
  },
  {
    id: "nextwork-cloud",
    label: "NextWork — Cloud-Native AI Engineering",
    issuing_body: "NextWork",
    status: "pending",
    badge_icon: "graduation",
    sort_order: 5,
    notes: "Production cloud infrastructure and AI application architectures.",
  },
  {
    id: "aws-cloud-practitioner",
    label: "AWS Certified Cloud Practitioner",
    issuing_body: "Amazon Web Services",
    status: "pending",
    badge_icon: "award",
    sort_order: 6,
    notes: "Entry-level AWS cert. Strong signal for cloud-adjacent roles.",
  },
];

// Safely fetch credentials from Supabase, handling missing config or missing table gracefully.
export async function GET() {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/credentials?select=*&order=sort_order.asc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          cache: "no-store",
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return NextResponse.json(data);
        }
      } else {
        console.warn(`Supabase credentials returned status ${res.status}, falling back to static certifications.`);
      }
    } catch (err) {
      console.warn("Credentials Supabase fetch error, using fallback:", err);
    }
  }

  return NextResponse.json(fallbackCredentials);
}

