import { ExternalLink, Clock, CheckCircle, Circle } from "lucide-react";
import type { Certification } from "@/types";

interface CertBadgeProps {
  cert: Certification;
}

const statusConfig = {
  earned: {
    icon: CheckCircle,
    color: "text-emerald-400",
    pillStyle: "text-emerald-400 bg-emerald-500/10 border-emerald-500/35 shadow-[0_2px_10px_rgba(16,185,129,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)]",
    label: "EARNED",
  },
  "in-progress": {
    icon: Clock,
    color: "text-rose-400",
    pillStyle: "text-rose-400 bg-rose-500/10 border-rose-500/35 shadow-[0_2px_10px_rgba(244,63,94,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)]",
    label: "IN PROGRESS",
  },
  planned: {
    icon: Circle,
    color: "text-amber-400",
    pillStyle: "text-amber-400 bg-amber-500/10 border-amber-500/35 shadow-[0_2px_10px_rgba(245,158,11,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)]",
    label: "PLANNED",
  },
};

export default function CertBadge({ cert }: CertBadgeProps) {
  const { icon: Icon, color, pillStyle, label } = statusConfig[cert.status];

  const inner = (
    <div className="group relative flex items-start gap-3.5 rounded-xl border border-white/10 border-l-[3.5px] border-l-[#ff1e42] bg-zinc-900/50 backdrop-blur-md backdrop-saturate-150 p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.12)] hover:border-cyan-400/40 hover:bg-zinc-900/65 hover:translate-x-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_20px_rgba(0,229,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-200">
      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex-shrink-0 mt-0.5">
        <Icon size={16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-snug tracking-wide">{cert.label}</p>
        <p className="text-xs text-zinc-400 mt-1 font-medium">{cert.issuingBody}</p>
        {cert.notes && <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{cert.notes}</p>}
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className={`rounded-md border px-2.5 py-1 text-[0.72rem] font-bold font-mono tracking-wider backdrop-blur-sm ${pillStyle}`}>
          {label}
        </span>
        {cert.verifyUrl && (
          <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 rounded backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group-hover:border-cyan-400/60 transition-colors">
            Official Link <ExternalLink size={10} />
          </span>
        )}
      </div>
    </div>
  );

  if (cert.verifyUrl) {
    return (
      <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
        {inner}
      </a>
    );
  }

  return inner;
}
