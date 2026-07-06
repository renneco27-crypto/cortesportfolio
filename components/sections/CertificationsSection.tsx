import CertBadge from "@/components/ui/CertBadge";
import { certificationsData } from "@/data/certifications";

export default function CertificationsSection() {
  const active = certificationsData.filter((c) => c.status !== "planned");
  const planned = certificationsData.filter((c) => c.status === "planned");

  return (
    <section id="certifications" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <span className="font-mono text-xs text-violet-400 uppercase tracking-widest">Credentials</span>
          <h2 className="text-4xl font-bold text-white mt-2">Certifications</h2>
          <p className="text-zinc-400 mt-2">Verified skills for PH internships and global tech roles.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">Earned / In Progress</p>
            {active.map((c) => <CertBadge key={c.id} cert={c} />)}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Roadmap</p>
            {planned.map((c) => <CertBadge key={c.id} cert={c} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
