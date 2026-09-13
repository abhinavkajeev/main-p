"use client";

import { useState } from "react";

interface ProjectCard {
  name: string;
  summary: string;
  videoSrc: string;
  posterSrc: string;
  tech: string[];
  link?: string;
}

interface ExpandCardsProps {
  projects: ProjectCard[];
}

const ExpandCards = ({ projects }: ExpandCardsProps) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <div className="w-full">
      <div className="flex w-full items-stretch justify-center gap-2">
        {projects.map((project, idx) => {
          const isExpanded = idx === expandedIndex;

          return (
            <div
              key={project.name}
              className="group relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out"
              style={{
                width: isExpanded ? "clamp(20rem, 50vw, 36rem)" : "clamp(3rem, 6vw, 5rem)",
                height: "28rem",
                flexShrink: 0,
              }}
              onMouseEnter={() => setExpandedIndex(idx)}
            >
              {/* Video / Poster */}
              {project.videoSrc ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={project.videoSrc}
                  poster={project.posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src={project.posterSrc}
                  alt={project.name}
                />
              )}

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Collapsed: rotated label */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: isExpanded ? 0 : 1 }}
              >
                <span
                  className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.3em] text-white/70"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  {project.name}
                </span>
              </div>

              {/* Expanded: project info */}
              <div
                className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 transition-all duration-500"
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                <p className="text-sm leading-relaxed text-white/60 line-clamp-2">
                  {project.summary}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandCards;
