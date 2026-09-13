import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const WEB3FORMS_KEY = "9759aae2-4824-48a8-b3a0-b39ec6aa8f86";

    // Send via Web3Forms API
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name,
        email,
        subject: subject
          ? `Portfolio: ${subject}`
          : `Portfolio Contact from ${name}`,
        message,
        from_name: "Portfolio Contact Form",
        replyto: email,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Web3Forms submission failed");
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
