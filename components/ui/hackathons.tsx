"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Trophy, MapPin, Calendar } from "lucide-react";

/* ─────────── Hackathon Data ─────────── */

interface HackathonEvent {
  name: string;
  date: string;
  location: string;
  description: string;
  won?: boolean;
  logo: string; // emoji or short text for the logo circle
  logoGradient: string; // tailwind gradient classes for the logo bg
}

const hackathons: HackathonEvent[] = [
  {
    name: "PEC Hacks",
    date: "December 27th – 28th",
    location: "Chennai, India",
    description:
      "Built an offline crypto transaction system using BLE mesh technology.",
    won: true,
    logo: "⚡",
    logoGradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Threx Hackathon",
    date: "January 28th – 31st",
    location: "Chennai, India",
    description:
      "Built an amazing blockchain game.",
    won: false,
    logo: "🎮",
    logoGradient: "from-violet-500 to-purple-700",
  },
  {
    name: "EthGlobal New Delhi",
    date: "September 26th – 28th, 2025",
    location: "New Delhi, India",
    description:
      "Women safety crypto storage solution.",
    won: false,
    logo: "🌐",
    logoGradient: "from-slate-600 to-slate-800",
  },
];

/* ─────────── Animations ─────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -40, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const dotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/* ─────────── Component ─────────── */

export default function Hackathons() {
  return (
    <section
      id="hackathons"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/3 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/[0.03] blur-[140px]" />
        <div className="absolute left-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-orange-500/60" />
            <p className="text-xs uppercase tracking-[0.6em] text-orange-400/80">
              Hackathons
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-500/60" />
          </div>

          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Building under{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              pressure
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            Endless possibilities brought to life by a group of motivated and
            passionate individuals — competing, shipping, and winning.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="relative"
        >
          {/* Vertical timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px sm:left-[31px]">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full w-full origin-top bg-gradient-to-b from-orange-500/40 via-white/10 to-transparent"
            />
          </div>

          {/* Events */}
          <div className="space-y-6">
            {hackathons.map((event, index) => (
              <div key={event.name} className="relative flex gap-6 sm:gap-8">
                {/* Timeline dot + logo */}
                <motion.div
                  variants={dotVariants}
                  className="relative z-10 flex-shrink-0"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${event.logoGradient} text-xl shadow-lg ring-4 ring-black sm:h-16 sm:w-16 sm:text-2xl`}
                  >
                    {event.logo}
                  </div>
                  {/* Glow behind logo */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full blur-md opacity-30"
                    style={{
                      background: `radial-gradient(circle, ${event.won ? "rgba(249,115,22,0.5)" : "rgba(255,255,255,0.15)"}, transparent)`,
                    }}
                  />
                </motion.div>

                {/* Card content */}
                <motion.div
                  variants={cardVariants}
                  className="group relative flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05]"
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at 50% 50%, ${event.won ? "rgba(249,115,22,0.06)" : "rgba(255,255,255,0.03)"}, transparent 60%)`,
                    }}
                  />

                  {/* Winner badge */}
                  {event.won && (
                    <div className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3 py-1">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        Winner
                      </span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="relative z-10 mb-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-white/30" />
                    <span className="text-xs text-white/40">{event.date}</span>
                  </div>

                  {/* Event name */}
                  <h3 className="relative z-10 text-lg font-bold text-white sm:text-xl">
                    {event.name}
                    {event.won && (
                      <span className="ml-2 inline-block">🏆</span>
                    )}
                  </h3>

                  {/* Location */}
                  <div className="relative z-10 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-white/30" />
                    <span className="text-xs text-white/40">{event.location}</span>
                  </div>

                  {/* Description */}
                  <p className="relative z-10 mt-3 text-sm leading-relaxed text-white/55">
                    {event.description}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className={`mt-4 h-px w-full ${
                      event.won
                        ? "bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-transparent"
                        : "bg-gradient-to-r from-white/10 to-transparent"
                    }`}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="mx-auto mt-16 h-px w-40 origin-center bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
    </section>
  );
}
