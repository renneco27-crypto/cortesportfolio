import { NextResponse } from "next/server";
import { certificationsData } from "@/data/certifications";
import type { PortfolioCredential } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nstyqceyjkgevnibfqks.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const fallbackCredentials: PortfolioCredential[] = [
  {
    id: "csc-professional",
    label: "Civil Service Exam — Professional Level",
    issuing_body: "Civil Service Commission (CSC), Philippines",
    status: "earned",
    badge_icon: "award",
    sort_order: 1,
    notes: "Passing score: 80%+. Required for PH gov internships. Covers English, Math, General Info, Analogies, Logical Reasoning.",
  },
  {
    id: "tesda-css-nc2",
    label: "Computer Systems Servicing NC II",
    issuing_body: "TESDA",
    status: "earned",
    badge_icon: "check",
    sort_order: 2,
    notes: "Hands-on practical assessment — hardware, OS, networking, troubleshooting.",
  },
  {
    id: "cisco-cybersecurity",
    label: "Intro to Cybersecurity & Networking Basics",
    issuing_body: "Cisco Networking Academy",
    status: "earned",
    badge_icon: "shield",
    sort_order: 3,
    notes: "Network security, packet analysis, threat defense fundamentals.",
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
  {
    id: "google-ads-cert",
    label: "Google Ads — Search Certification",
    issuing_body: "Google Skillshop",
    status: "pending",
    badge_icon: "award",
    sort_order: 7,
    notes: "Free. Reinforces digital growth & funnel architecture.",
  },
  {
    id: "meta-social-cert",
    label: "Meta Social Media Marketing Certificate",
    issuing_body: "Meta / Coursera",
    status: "pending",
    badge_icon: "award",
    sort_order: 8,
    notes: "Backs up marketing funnel expertise with Meta ecosystem credential.",
  },
];

// Safely fetch credentials from Supabase, handling missing config or missing table gracefully.
export async function GET() {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
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

