import { ExternalLink, Clock, CheckCircle, Circle } from "lucide-react";
import type { Certification } from "@/types";

interface CertBadgeProps {
  cert: Certification;
}

const statusConfig = {
  earned: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Earned" },
  "in-progress": { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "In Progress" },
  planned: { icon: Circle, color: "text-zinc-500", bg: "bg-zinc-800", label: "Planned" },
};

export default function CertBadge({ cert }: CertBadgeProps) {
  const { icon: Icon, color, bg, label } = statusConfig[cert.status];

  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-700/40 bg-zinc-900 p-4 hover:border-zinc-600 transition-colors">
      <Icon size={18} className={`${color} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white leading-snug">{cert.label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{cert.issuingBody}</p>
        {cert.notes && <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{cert.notes}</p>}
      </div>
      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-mono ${bg} ${color}`}>
        {label}
      </span>
    </div>
  );

  if (cert.verifyUrl) {
    return (
      <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }

  return inner;
}
