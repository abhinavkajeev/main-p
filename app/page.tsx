"use client";

import { useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Code2,
  Layers,
  Zap,
  Terminal,
  ArrowRight,
  Sparkles,
  Globe,
  CodeXml,
} from "lucide-react";
import { Waves } from "@/components/ui/wave-background";
import HalideLanding from "@/components/ui/halide-topo-demo";
import ExpandCards from "@/components/ui/expand-cards";
import SchemaProjectCard from "@/components/ui/schema-project-card";
import PixelCat from "@/components/ui/pixel-cat";

/* ─────────────── SVG Social Icons ─────────────── */

const GitHubSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XTwitterSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ─────────────── Data ─────────────── */

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#connect" },
];

const aboutDetails = {
  greeting: "Hey, I'm Abhinav",
  title: "I build things that live on the internet.",
  bio: "I'm a developer who's passionate about crafting end-to-end digital experiences — from pixel-perfect frontends to robust backend systems. I love working at the intersection of design and engineering, where beautiful interfaces meet scalable architecture.",
  bio2: "Whether it's building decentralized payment systems over Bluetooth mesh networks, creating cinematic web experiences, or architecting full-stack applications — I bring systems thinking and obsessive attention to detail to every project.",
  specialties: [
    { icon: Code2, label: "Full-Stack Engineering", detail: "React, Next.js, Node.js, TypeScript — end to end." },
    { icon: Layers, label: "Blockchain & Web3", detail: "Smart contracts, DeFi protocols, and mesh architectures." },
    { icon: Zap, label: "Motion & Interaction", detail: "Framer Motion, 3D CSS, WebGL — interfaces that feel alive." },
    { icon: Terminal, label: "Systems & Infrastructure", detail: "Cloud, CI/CD, BLE protocols, embedded systems." },
  ],
};

const techStack = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Solidity", "Rust", "Python", "Go",
  "PostgreSQL", "Redis", "Docker", "AWS",
  "Framer Motion", "Three.js", "TailwindCSS", "GraphQL",
];

const expandProjects = [
  {
    name: "MeshT",
    summary: "Offline BLE mesh payment system — crypto transactions without internet via Bluetooth mesh networks.",
    videoSrc: "https://videos.pexels.com/video-files/5532772/5532772-sd_640_360_25fps.mp4",
    posterSrc: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
    tech: ["React Native", "Solidity", "BLE", "Flow EVM"],
  },
  {
    name: "Luminari Studio",
    summary: "Cinematic portfolio engine with scroll-driven 3D parallax and topographic depth layers.",
    videoSrc: "https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_25fps.mp4",
    posterSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    tech: ["Next.js", "Framer Motion", "3D CSS"],
  },
  {
    name: "Signal Lattice",
    summary: "Fintech analytics dashboard with depth-aware visualizations and real-time data streams.",
    videoSrc: "https://videos.pexels.com/video-files/7579965/7579965-sd_640_360_25fps.mp4",
    posterSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    tech: ["React", "D3.js", "WebSocket", "Node.js"],
  },
  {
    name: "Aurora Pay",
    summary: "Cross-chain payment gateway with instant settlement and multi-wallet support.",
    videoSrc: "https://videos.pexels.com/video-files/6963744/6963744-sd_640_360_25fps.mp4",
    posterSrc: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
    tech: ["Rust", "Solana", "React", "PostgreSQL"],
  },
  {
    name: "Nexus AI",
    summary: "AI-powered code review assistant with context-aware suggestions and auto-fixes.",
    videoSrc: "https://videos.pexels.com/video-files/8721093/8721093-sd_640_360_25fps.mp4",
    posterSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    tech: ["Python", "LangChain", "Next.js", "Docker"],
  },
];

const gridProjects = [
  { name: "MeshT", summary: "Offline BLE mesh payment system — crypto transactions without internet via Bluetooth mesh networks. Integrated SMS notifications and UPI payouts.", tech: ["React Native", "Solidity", "BLE", "Flow EVM"], accentColor: "orange" },
  { name: "Luminari Studio", summary: "Cinematic portfolio engine with scroll-driven 3D parallax, topographic depth layers, and custom wheel/touch event handlers.", tech: ["Next.js", "Framer Motion", "3D CSS", "TypeScript"], accentColor: "violet" },
  { name: "Signal Lattice", summary: "Fintech analytics dashboard with depth-aware visualizations, real-time data streams, and interactive chart tiles.", tech: ["React", "D3.js", "WebSocket", "Node.js"], accentColor: "cyan" },
  { name: "Aurora Pay", summary: "Cross-chain payment gateway with instant settlement, multi-wallet support, and gasless meta-transactions.", tech: ["Rust", "Solana", "React", "PostgreSQL"], accentColor: "emerald" },
  { name: "Nexus AI", summary: "AI-powered code review assistant with context-aware suggestions, auto-fixes, and CI pipeline integration.", tech: ["Python", "LangChain", "Next.js", "Docker"], accentColor: "pink" },
  { name: "DevForge", summary: "Developer collaboration platform with real-time pair programming, Git-integrated workspace, and AI-assisted debugging tools.", tech: ["Go", "WebRTC", "React", "Redis"], accentColor: "indigo" },
];

const contactActions = [
  {
    label: "Email me",
    href: "mailto:abhinavka@example.com",
    tone: "Let's talk about your next project",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    tone: "Check out my open source work",
    icon: CodeXml,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    tone: "Let's connect professionally",
    icon: Globe,
  },
];

/* ─────────────── Animation Variants ─────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────────── Page Component ─────────────── */

export default function Home() {
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="bg-[#000000] text-white">
      {/* ━━━━━ Pixel Cat follows cursor ━━━━━ */}
      <PixelCat />


      {/* ━━━━━ FLOATING LIQUID GLASS NAVBAR ━━━━━ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      >
        <div
          className="flex items-center gap-1 rounded-full px-2 py-2 sm:gap-2 sm:px-3"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(255, 255, 255, 0.02)",
          }}
        >


          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}

          {/* CTA */}

        </div>
      </motion.nav>

      {/* ━━━━━ HERO SECTION — Waves Background ━━━━━ */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Wave Background */}
        <Waves
          className="h-full w-full"
          strokeColor="rgba(255, 255, 255, 0.3)"
          backgroundColor="#000000"
        />

        {/* Radial gradient overlay to add depth */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.12) 0%, transparent 40%)",
          }}
        />

        {/* Hero Content at z-index 10 */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-12 lg:px-20">
          <div className="pointer-events-auto w-full max-w-5xl">

            {/* Top row: Name + Photo */}
            <div className="flex items-start justify-between gap-8">
              {/* Left — Name & Subtitle */}
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.9, ease: "easeOut" }}
                  className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  Hi, I&apos;m Abhinav{" "}
                  <span className="inline-block animate-[wave_2.5s_ease-in-out_infinite]">👋</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="mt-4 max-w-xl text-lg leading-relaxed text-white/50 sm:text-lg lg:text-xl"
                >
                  Code artisan and systems thinker. I build immersive web experiences and decentralized applications that push boundaries.
                </motion.p>
              </div>

              {/* Right — Profile Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
                className="hidden flex-shrink-0 sm:block"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-white/10 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                  <img
                    src="/profile.png"
                    alt="Abhinav KA"
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle glow behind photo */}
                  <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]" />
                </div>
              </motion.div>
            </div>

            {/* About block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.7 }}
              className="mt-10 max-w-2xl"
            >
              <h2 className="text-lg font-bold text-white sm:text-xl">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/45 sm:text-base">
                I am a builder at heart. After cutting my teeth as a frontend engineer and winning an international hackathon, I dove headfirst into the world of Web3 in late 2023 to build my own vision. Since then, I&apos;ve been experimenting at the bleeding edge of technology—fusing blockchain architecture, artificial intelligence, and high-performance frontends to create digital experiences that don&apos;t just function, but captivate.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="#projects"
                className="group flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#connect"
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/70 transition hover:border-white/50 hover:text-white hover:bg-white/[0.05]"
              >
                Contact Me
              </Link>

              {/* Social Icons inline */}
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-full border border-white/10 p-2.5 transition hover:border-white/30 hover:bg-white/[0.06]"
                  aria-label="GitHub"
                >
                  <GitHubSvg className="h-4.5 w-4.5 text-white/40 transition group-hover:text-white" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-full border border-white/10 p-2.5 transition hover:border-white/30 hover:bg-white/[0.06]"
                  aria-label="LinkedIn"
                >
                  <LinkedInSvg className="h-4.5 w-4.5 text-white/40 transition group-hover:text-white" />
                </Link>
                <Link
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-full border border-white/10 p-2.5 transition hover:border-white/30 hover:bg-white/[0.06]"
                  aria-label="X (Twitter)"
                >
                  <XTwitterSvg className="h-4.5 w-4.5 text-white/40 transition group-hover:text-white" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Scroll</span>
            <div className="h-8 w-px animate-pulse bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ━━━━━ ABOUT ME — Full-screen Halide 3D background ━━━━━ */}
      <section id="about">
        <HalideLanding>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mx-auto w-full max-w-5xl"
          >
            {/* Top tag */}
            <motion.div variants={fadeUp} custom={0} className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-gradient-to-r from-orange-500 to-transparent" />
              <p className="text-xs uppercase tracking-[0.5em] text-orange-400/80">About Me</p>
            </motion.div>

            {/* Main grid */}
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left — bio */}
              <div className="space-y-6">
                <motion.p
                  variants={fadeUp}
                  custom={1}
                  className="text-sm uppercase tracking-[0.4em] text-white/40"
                >
                  {aboutDetails.greeting}
                </motion.p>

                <motion.h2
                  variants={fadeUp}
                  custom={2}
                  className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
                >
                  {aboutDetails.title}
                </motion.h2>

                <motion.p variants={fadeUp} custom={3} className="text-base leading-relaxed text-white/70">
                  {aboutDetails.bio}
                </motion.p>

                <motion.p variants={fadeUp} custom={4} className="text-sm leading-relaxed text-white/50">
                  {aboutDetails.bio2}
                </motion.p>

                {/* CTA */}
                <motion.div variants={fadeUp} custom={5} className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="#connect"
                    className="rounded-full bg-white/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Get in touch
                  </Link>
                  <Link
                    href="#projects"
                    className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 transition hover:border-white/50 hover:text-white"
                  >
                    See my work →
                  </Link>
                </motion.div>
              </div>

              {/* Right — specialties grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {aboutDetails.specialties.map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    variants={fadeUp}
                    custom={i + 3}
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20">
                        <spec.icon className="h-4 w-4 text-orange-400" />
                      </div>
                      <p className="text-sm font-semibold text-white">{spec.label}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-white/50">{spec.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech stack ribbon */}
            <motion.div variants={fadeUp} custom={8} className="mt-14">
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/30">Tech I work with</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/50 transition hover:border-white/25 hover:text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </HalideLanding>
      </section>

      {/* ━━━━━ PROJECTS ━━━━━ */}
      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-20 sm:px-10 lg:px-0">
        <section id="projects" className="space-y-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-white/60">Selected Work</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Projects with{" "}
                <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  depth
                </span>
              </h2>
            </div>
            <button
              onClick={() => setViewAll((v) => !v)}
              className="hidden text-sm font-semibold text-white/50 transition hover:text-white sm:block cursor-pointer"
            >
              {viewAll ? "← Collapse" : "View all →"}
            </button>
          </div>

          {/* Animated layout swap */}
          <motion.div
            key={viewAll ? "grid" : "expand"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {viewAll ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gridProjects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    <SchemaProjectCard
                      name={project.name}
                      summary={project.summary}
                      tech={project.tech}
                      accentColor={project.accentColor}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <ExpandCards projects={expandProjects} />
            )}
          </motion.div>
        </section>

        {/* ━━━━━ CONNECT ━━━━━ */}
        <section
          id="connect"
          className="relative overflow-hidden rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-[#0b1220]/90 to-[#1a0a2e]/90 p-8 shadow-[0_50px_120px_rgba(0,0,0,0.7)] sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px]" />

          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-orange-400" />
                <p className="text-xs uppercase tracking-[0.6em] text-white/60">Let&apos;s Connect</p>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Got a project in mind?
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/60">
                I&apos;m always interested in hearing about new projects, creative ideas, or opportunities
                to be part of something amazing. Let&apos;s create something extraordinary together.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {contactActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  target={action.href.startsWith("http") ? "_blank" : undefined}
                  rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 transition group-hover:from-orange-500/30 group-hover:to-pink-500/30">
                    <action.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-white">{action.label}</span>
                    <span className="text-xs text-white/40">{action.tone}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━━ FOOTER ━━━━━ */}
        <footer className="flex flex-col items-center gap-4 pb-8 text-center">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="text-xs text-white/30">
            Designed & built by Abhinav · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
