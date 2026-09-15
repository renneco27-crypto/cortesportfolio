"use client";
import { useState } from "react";
import SkillCard from "@/components/ui/SkillCard";
import { skillsData } from "@/data/skills";
import type { SkillCategory } from "@/types";

const categories: { label: string; value: SkillCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Design", value: "design" },
  { label: "Security", value: "security" },
  { label: "AI", value: "ai" },
  { label: "Marketing", value: "marketing" },
];

export default function SkillsSection() {
  const [active, setActive] = useState<SkillCategory | "all">("all");

  const filtered = active === "all"
    ? skillsData
    : skillsData.filter((s) => s.category === active);

  return (
    <section id="skills" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <span className="font-mono text-xs text-violet-400 uppercase tracking-widest">Skills</span>
          <h2 className="text-4xl font-bold text-white mt-2">What I Build With</h2>
          <p className="text-zinc-400 mt-2">Every skill linked to a real project.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-mono transition-colors ${
                active === cat.value
                  ? "bg-violet-600 text-white"
                  : "border border-zinc-700 text-zinc-400 hover:border-violet-500 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} onCardClick={(id) => console.log("skill:", id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
