import { ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const funnelSteps = [
  { label: "TikTok Content", detail: "Short-form · Dev tips · Brand process", chip: "Organic reach" },
  { label: "TikTok Pixel", detail: "Events API + server-side tracking", chip: "Attribution" },
  { label: "Portfolio Landing", detail: "Next.js App Router · AI chatbot", chip: "Conversion page" },
  { label: "Lead Captured", detail: "Neon DB · Email · Contact form", chip: "150 leads" },
];

export default function TikTokFunnelSection() {
  return (
    <section id="funnel" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl flex flex-col gap-12">
        <div>
          <span className="font-mono text-xs text-violet-400 uppercase tracking-widest">Marketing</span>
          <h2 className="text-4xl font-bold text-white mt-2">From Views to Clients</h2>
          <p className="text-zinc-400 mt-2">TikTok content → Pixel tracking → Lead capture → CRM</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {funnelSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4 flex-1">
              <div className="flex-1 rounded-xl border border-zinc-700/40 bg-zinc-900 p-4 flex flex-col gap-2">
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="text-xs text-zinc-500">{step.detail}</p>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400 font-mono w-fit">{step.chip}</span>
              </div>
              {i < funnelSteps.length - 1 && (
                <ArrowRight size={16} className="text-zinc-600 flex-shrink-0 hidden md:block" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {
            [
              { value: 150, suffix: "+", label: "Leads captured" },
              { value: 30, suffix: "%", label: "CPA reduction" },
              { value: 3, suffix: "x", label: "Chatbot interactions / visit" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
                <p className="text-4xl font-bold text-violet-400 font-mono">
                  <AnimatedCounter targetValue={m.value} suffix={m.suffix} />
                </p>
                <p className="text-xs text-zinc-500 mt-1">{m.label}</p>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}
