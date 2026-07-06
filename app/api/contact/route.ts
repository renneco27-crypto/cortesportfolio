import { NextResponse } from "next/server";

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const senderName = sanitize(body.senderName || body.name || "");
    const senderEmail = sanitize(body.senderEmail || body.email || "");
    const messageBody = sanitize(body.messageBody || body.message || "");

    if (!senderName || !senderEmail || !messageBody) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("=== NEW CONTACT FORM SUBMISSION ===");
    console.log("Name:", senderName);
    console.log("Email:", senderEmail);
    console.log("Message:", messageBody);
    console.log("===================================");

    return NextResponse.json({
      success: true,
      message: "Message received! Lawrence will get back to you soon.",
    });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
