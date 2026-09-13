"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "9759aae2-4824-48a8-b3a0-b39ec6aa8f86",
          name: formData.name,
          email: formData.email,
          subject: formData.subject
            ? `Portfolio: ${formData.subject}`
            : `Portfolio Contact from ${formData.name}`,
          message: formData.message,
          from_name: "Portfolio Contact Form",
          replyto: formData.email,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset after 5s
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to send message"
      );
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputFields = [
    {
      name: "name",
      label: "Your Name",
      type: "text",
      icon: User,
      placeholder: "John Doe",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      icon: Mail,
      placeholder: "john@example.com",
      required: true,
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      icon: FileText,
      placeholder: "Project collaboration",
      required: false,
    },
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Input fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {inputFields.map((field) => {
          const Icon = field.icon;
          const isFocused = focusedField === field.name;
          const hasValue = formData[field.name as keyof typeof formData] !== "";

          return (
            <div
              key={field.name}
              className={`group relative ${field.name === "subject" ? "sm:col-span-2" : ""}`}
            >
              {/* Floating label */}
              <label
                htmlFor={`contact-${field.name}`}
                className={`pointer-events-none absolute left-11 z-10 transition-all duration-200 ${
                  isFocused || hasValue
                    ? "top-2 text-[10px] uppercase tracking-[0.15em] text-orange-400/80"
                    : "top-1/2 -translate-y-1/2 text-sm text-white/30"
                }`}
              >
                {field.label}
                {field.required && (
                  <span className="ml-0.5 text-orange-500/60">*</span>
                )}
              </label>

              <div className="relative">
                {/* Icon */}
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    isFocused ? "text-orange-400" : "text-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Input */}
                <input
                  id={`contact-${field.name}`}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  required={field.required}
                  placeholder={isFocused ? field.placeholder : ""}
                  className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pb-3 pl-11 pr-4 pt-6 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/15 hover:border-white/15 focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(249,115,22,0.06)]"
                />

                {/* Active indicator line */}
                <div
                  className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300 ${
                    isFocused ? "w-[calc(100%-32px)] opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Message textarea */}
      <div className="group relative">
        <label
          htmlFor="contact-message"
          className={`pointer-events-none absolute left-11 z-10 transition-all duration-200 ${
            focusedField === "message" ||
            formData.message !== ""
              ? "top-3 text-[10px] uppercase tracking-[0.15em] text-orange-400/80"
              : "top-5 text-sm text-white/30"
          }`}
        >
          Your Message <span className="ml-0.5 text-orange-500/60">*</span>
        </label>

        <div className="relative">
          <div
            className={`absolute left-4 top-5 transition-colors duration-200 ${
              focusedField === "message" ? "text-orange-400" : "text-white/20"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
          </div>

          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            required
            rows={5}
            placeholder={
              focusedField === "message"
                ? "Tell me about your project, idea, or just say hello..."
                : ""
            }
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] pb-4 pl-11 pr-4 pt-7 text-sm leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-white/15 hover:border-white/15 focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(249,115,22,0.06)]"
          />

          <div
            className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300 ${
              focusedField === "message"
                ? "w-[calc(100%-32px)] opacity-100"
                : "w-0 opacity-0"
            }`}
          />
        </div>

        {/* Character count */}
        <div className="mt-1.5 flex justify-end pr-2">
          <span
            className={`text-[10px] tabular-nums transition-colors ${
              formData.message.length > 1000
                ? "text-orange-400"
                : "text-white/20"
            }`}
          >
            {formData.message.length > 0 && `${formData.message.length} / 2000`}
          </span>
        </div>
      </div>

      {/* Submit button & status */}
      <div className="flex items-center gap-4 pt-1">
        <motion.button
          type="submit"
          disabled={status === "sending" || status === "success"}
          whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
          whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
          className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-3.5 text-sm font-semibold transition-all duration-300 ${
            status === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : status === "error"
                ? "border border-red-500/30 bg-red-500/10 text-red-400"
                : "cursor-pointer border border-white/10 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:shadow-[0_0_40px_rgba(249,115,22,0.25)]"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {/* Shimmer effect */}
          {status === "idle" && (
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          )}

          <AnimatePresence mode="wait">
            {status === "sending" && (
              <motion.span
                key="sending"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </motion.span>
            )}
            {status === "success" && (
              <motion.span
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Message Sent!
              </motion.span>
            )}
            {status === "error" && (
              <motion.span
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </motion.span>
            )}
            {status === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative z-10 flex items-center gap-2"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Send Message
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Encryption note */}
        <p className="text-[11px] text-white/25">
          Your message will be sent directly to my inbox.
        </p>
      </div>
    </form>
  );
}
