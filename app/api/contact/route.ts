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

    const formData = {
      access_key: WEB3FORMS_KEY,
      name,
      email,
      subject: subject
        ? `Portfolio: ${subject}`
        : `Portfolio Contact from ${name}`,
      message,
      from_name: "Portfolio Contact Form",
      replyto: email,
    };

    // Send via Web3Forms API with explicit headers and cache bypass
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    // Check if we got HTML back instead of JSON (proxy/redirect issue)
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non-JSON response from Web3Forms:", text.substring(0, 200));
      return NextResponse.json(
        { error: "Email service returned unexpected response. Status: " + res.status },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.message || "Failed to send message." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Contact form error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
