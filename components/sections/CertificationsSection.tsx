import { ExternalLink, Clock, CheckCircle2, Compass, ShieldCheck } from "lucide-react";
import { certificationsData } from "@/data/certifications";
import type { Certification } from "@/types";

export default function CertificationsSection() {
  const columns: { title: string; subtitle: string; items: Certification[] }[] = [
    {
      title: "01 / Civil & National",
      subtitle: "Public Service & Hardware",
      items: certificationsData.filter((c) =>
        ["csc-professional", "tesda-css-nc2"].includes(c.id)
      ),
    },
    {
      title: "02 / Security & Network",
      subtitle: "Offensive & Defensive Systems",
      items: certificationsData.filter((c) =>
        ["pwncollege-badge", "cisco-cybersecurity"].includes(c.id)
      ),
    },
    {
      title: "03 / Cloud & AI Track",
      subtitle: "Infrastructure Roadmap",
      items: certificationsData.filter((c) =>
        ["nextwork-cloud", "aws-cloud-practitioner"].includes(c.id)
      ),
    },
  ];

  return (
    <section id="certifications" className="py-20 px-6 bg-[#f4f2ed] text-[#171717] border-t border-black/10">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest text-neutral-600">
              <ShieldCheck className="h-3.5 w-3.5 text-[#689400]" />
              Credentials
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900 mt-3">
              Certifications &amp; Standards
            </h2>
          </div>
          <p className="text-xs text-neutral-500 max-w-xs">
            Technical certifications and credentials in software systems, networking, and cloud infrastructure.
          </p>
        </div>

        {/* 3 Columns Separated by Vertical Divider Lines */}
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_50px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 divide-y divide-neutral-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {columns.map((col, idx) => (
              <div key={col.title} className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <div>
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#689400]">
                        {col.title}
                      </span>
                      <h3 className="text-sm font-extrabold text-neutral-900 mt-0.5">
                        {col.subtitle}
                      </h3>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 font-mono text-[10px] font-black text-neutral-700">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {col.items.map((cert) => {
                      const isPlanned = cert.status === "planned";
                      return (
                        <div
                          key={cert.id}
                          className="rounded-2xl border border-neutral-200 bg-[#faf9f6] p-4 transition-all hover:border-black hover:bg-white hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                  isPlanned
                                    ? "bg-neutral-200 text-neutral-700"
                                    : "bg-[#141414] text-[#b8ff01]"
                                }`}
                              >
                                {cert.status === "earned" ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : isPlanned ? (
                                  <Compass className="h-3.5 w-3.5" />
                                ) : (
                                  <Clock className="h-3.5 w-3.5" />
                                )}
                              </span>
                              <div>
                                <p className="text-xs sm:text-sm font-extrabold text-neutral-900 leading-snug">
                                  {cert.label}
                                </p>
                                <p className="text-[11px] font-medium text-neutral-500 mt-1">
                                  {cert.issuingBody}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider ${
                                isPlanned
                                  ? "border border-neutral-300 bg-white text-neutral-600"
                                  : "bg-[#b8ff01]/35 text-neutral-900"
                              }`}
                            >
                              {cert.status === "in-progress" ? "IN PROGRESS" : cert.status.toUpperCase()}
                            </span>
                          </div>
                          {cert.verifyUrl && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-200/70 flex justify-end">
                              <a
                                href={cert.verifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-900 hover:underline"
                              >
                                Official Link <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
