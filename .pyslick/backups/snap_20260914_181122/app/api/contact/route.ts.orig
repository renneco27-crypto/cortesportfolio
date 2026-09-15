import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { sanitize } from "@/lib/sanitize";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

const CONTACT_DAILY_LIMIT = 3;    // max contact form submissions per IP per 24h
const DAILY_LIMIT_TTL = 86400;    // 24 hours in seconds
const MAX_NAME_CHARS = 100;
const MAX_EMAIL_CHARS = 150;
const MAX_MESSAGE_CHARS = 2000;

// ─────────────────────────────────────────────
// RATE LIMITER — burst protection (2 req / 60 s)
// ─────────────────────────────────────────────
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "60 s"),
  analytics: true,
});

// ─────────────────────────────────────────────
// DAILY LIMIT — 3 form submissions per IP / 24h
// ─────────────────────────────────────────────
const redis = Redis.fromEnv();

async function getContactCount(ip: string): Promise<number> {
  const count = await redis.get<number>(`contact_daily_${ip}`);
  return count ?? 0;
}

async function incrementContactCount(ip: string): Promise<number> {
  const key = `contact_daily_${ip}`;
  const newCount = await redis.incr(key);
  if (newCount === 1) await redis.expire(key, DAILY_LIMIT_TTL);
  return newCount;
}

// ─────────────────────────────────────────────
// SPAM / INJECTION DETECTION
// Adapted from the chat jailbreak detector —
// blocks scripting, injection, and bulk-paste spam
// ─────────────────────────────────────────────
const SPAM_PATTERNS = [
  // Script / code injection
  /<script[\s\S]*?>/i,
  /javascript:/i,
  /on\w+\s*=/i,             // onclick=, onload=, etc.
  /eval\s*\(/i,
  /base64/i,

  // Promotional / SEO spam
  /\bcasino\b/i,
  /\bforex\b/i,
  /\bcrypto investment\b/i,
  /\bmake money fast\b/i,
  /\bwork from home\b/i,
  /\bclick here\b/i,
  /\bunsubscribe\b/i,
  /\bviagra\b/i,
  /\bsex\b/i,

  // Mass link pasting (3+ URLs in one message)
  /(https?:\/\/\S+\s*){3,}/i,

  // SQL injection
  /(\bSELECT\b.*\bFROM\b|\bDROP\b.*\bTABLE\b|\bINSERT\b.*\bINTO\b)/i,
];

function detectSpam(text: string): boolean {
  return SPAM_PATTERNS.some((p) => p.test(text));
}

// ─────────────────────────────────────────────
// EMAIL VALIDATION
// ─────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─────────────────────────────────────────────
// CLOUDFLARE TURNSTILE VERIFICATION
// ─────────────────────────────────────────────
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    console.warn("⚠️  TURNSTILE_SECRET not set — skipping bot check (dev only)");
    return true;
  }
  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: formData });
  const data = await res.json() as { success: boolean };
  return data.success === true;
}

// ─────────────────────────────────────────────
// SEND VIA EMAILJS REST API (server-side)
// Keeps the public key + service/template IDs
// out of the browser entirely.
// ─────────────────────────────────────────────
async function sendEmailJS(params: {
  name: string;
  email: string;
  message: string;
  templateId: string;
}) {
  const serviceId  = process.env.EMAILJS_SERVICE_ID!;
  const publicKey  = process.env.EMAILJS_PUBLIC_KEY!;

  const res = await fetch(EMAILJS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  serviceId,
      template_id: params.templateId,
      user_id:     publicKey,
      template_params: {
        name:       params.name,
        from_email: params.email,
        title:      params.message.slice(0, 60),
        message:    params.message,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`EmailJS error: ${err}`);
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function err(msg: string, status: number) {
  return NextResponse.json({ success: false, message: msg }, { status });
}

// ─────────────────────────────────────────────
// GET /api/contact — submission status for this IP
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const count = await getContactCount(ip);
  const submissionsLeft = Math.max(0, CONTACT_DAILY_LIMIT - count);
  return NextResponse.json({ submissionsLeft, limitReached: submissionsLeft === 0 });
}

// ─────────────────────────────────────────────
// POST /api/contact — secured contact form endpoint
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const body = await req.json();

    // ── 0. TURNSTILE BOT CHECK ──────────────
    const turnstileToken: string = body.turnstileToken ?? "";
    if (!turnstileToken) {
      return err("Human verification required.", 400);
    }
    try {
      const isHuman = await verifyTurnstile(turnstileToken, ip);
      if (!isHuman) return err("Human verification failed. Please try again.", 403);
    } catch {
      return err("Verification service unavailable. Please try again shortly.", 503);
    }

    // ── 1. BURST RATE LIMIT ─────────────────
    const { success: underBurst } = await ratelimit.limit(`contact_burst_${ip}`);
    if (!underBurst) {
      return err("You're submitting too fast. Please wait a moment.", 429);
    }

    // ── 2. DAILY IP LIMIT ───────────────────
    const currentCount = await getContactCount(ip);
    if (currentCount >= CONTACT_DAILY_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          message: `You've already sent ${CONTACT_DAILY_LIMIT} messages today. Please try again tomorrow or reach out on LinkedIn.`,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // ── 3. SANITIZE & VALIDATE INPUT ────────
    const rawName    = body.senderName    ?? body.name    ?? "";
    const rawEmail   = body.senderEmail   ?? body.email   ?? "";
    const rawMessage = body.messageBody   ?? body.message ?? "";

    const name    = sanitize(rawName,    MAX_NAME_CHARS);
    const email   = sanitize(rawEmail,   MAX_EMAIL_CHARS).toLowerCase();
    const message = sanitize(rawMessage, MAX_MESSAGE_CHARS);

    if (!name || name.length < 2) {
      return err("Please enter your name (at least 2 characters).", 400);
    }
    if (!email || !isValidEmail(email)) {
      return err("Please enter a valid email address.", 400);
    }
    if (!message || message.length < 10) {
      return err("Your message is too short. Please say a bit more!", 400);
    }

    // ── 4. SPAM / INJECTION CHECK ───────────
    // Check all fields — not just the message
    if (detectSpam(name) || detectSpam(email) || detectSpam(message)) {
      return err("Your message was flagged as spam. If this is a mistake, contact Lawrence on LinkedIn.", 400);
    }

    // ── 5. INCREMENT DAILY COUNTER ──────────
    // Only after all checks pass — valid submissions cost 1 credit
    await incrementContactCount(ip);

    // ── 6. SEND EMAILS VIA EMAILJS ──────────
    const contactTemplateId  = process.env.EMAILJS_TEMPLATE_ID_CONTACT!;
    const autoreplyTemplateId = process.env.EMAILJS_TEMPLATE_ID_AUTOREPLY!;

    // Send both in parallel — notification to Lawrence + autoreply to sender
    await Promise.all([
      sendEmailJS({ name, email, message, templateId: contactTemplateId }),
      sendEmailJS({ name, email, message, templateId: autoreplyTemplateId }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Message sent! Lawrence will get back to you soon. 🙌",
    });

  } catch (error) {
    console.error("Contact route error:", error);
    return err("Something went wrong. Please try again or reach out on LinkedIn.", 500);
  }
}
