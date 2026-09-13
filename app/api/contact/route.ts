import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // Create transporter — uses Gmail SMTP
    // Set GMAIL_USER and GMAIL_APP_PASSWORD in your .env.local
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      to: "abhiajeev@gmail.com",
      replyTo: email,
      subject: subject
        ? `Portfolio Contact: ${subject}`
        : `Portfolio Contact from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #222; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 24px 32px;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">New Message from Portfolio</h1>
          </div>
          <div style="padding: 32px;">
            <div style="margin-bottom: 24px;">
              <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px;">From</p>
              <p style="color: #fff; font-size: 16px; margin: 0;">${name}</p>
            </div>
            <div style="margin-bottom: 24px;">
              <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px;">Email</p>
              <p style="color: #f97316; font-size: 16px; margin: 0;"><a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></p>
            </div>
            ${subject ? `
            <div style="margin-bottom: 24px;">
              <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px;">Subject</p>
              <p style="color: #fff; font-size: 16px; margin: 0;">${subject}</p>
            </div>
            ` : ""}
            <div style="margin-bottom: 8px;">
              <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px;">Message</p>
              <div style="color: #ccc; font-size: 15px; line-height: 1.7; background: #111; border-radius: 12px; padding: 20px; border: 1px solid #222;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid #222; text-align: center;">
            <p style="color: #555; font-size: 12px; margin: 0;">Sent from your portfolio contact form</p>
          </div>
        </div>
      `,
    };

    // If env vars aren't configured, return an error
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("❌ GMAIL_USER or GMAIL_APP_PASSWORD not set in environment variables");
      return NextResponse.json(
        { error: "Email service is not configured. Please set environment variables." },
        { status: 500 }
      );
    }

    await transporter.sendMail(mailOptions);

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
