"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Skill } from "@/types";

interface SkillCardProps {
  skill: Skill;
  onCardClick: (skillId: string) => void;
}

const proficiencyColors: Record<string, string> = {
  learning: "bg-zinc-500",
  competent: "bg-yellow-400",
  proficient: "bg-emerald-400",
  expert: "bg-violet-400",
};

export default function SkillCard({ skill, onCardClick }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 0 24px rgba(124,58,237,0.2)" }}
      transition={{ duration: 0.2 }}
      onClick={() => onCardClick(skill.id)}
      className="cursor-pointer rounded-xl border border-zinc-700/40 bg-zinc-900 p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="relative h-8 w-8">
          <Image src={skill.iconSrc} alt={skill.label} fill className="object-contain" />
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full ${proficiencyColors[skill.proficiencyLevel]}`}
          title={skill.proficiencyLevel}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{skill.label}</p>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">{skill.yearsOfExperience}yr exp</p>
      </div>
    </motion.div>
  );
}
