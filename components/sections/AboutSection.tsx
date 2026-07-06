"use client";
import Image from "next/image";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-zinc-800/50 bg-zinc-950 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400">About</span>

          <div className="order-2 md:order-none">
            <h2 className="text-4xl font-bold text-white">Developer by code, designer by eye.</h2>
          </div>

          <div className="order-1 md:hidden">
            <div className="relative mx-auto mb-6 h-72 w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
              <Image
                src="/images/lawrence-face.jpg"
                alt="Lawrence Cortes"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <p className="text-zinc-400 leading-relaxed">I'm Lawrence Cortes, a full‑stack developer based in Cebu, Philippines. I specialize in building performant web applications with React, Next.js, and TypeScript, and I bring a strong eye for design. I have reduced CPA by 30% for a client, increased lead capture by 20%, and streamlined workflows resulting in 25% time savings.</p>

          <p className="text-zinc-400 leading-relaxed">
            Currently pursuing internship opportunities where I can apply my skills in full-stack
            development, AI integration, and creative problem-solving.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="relative hidden md:block">
            <div className="relative h-[520px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
              <Image
                src="/images/lawrence-face.jpg"
                alt="Lawrence Cortes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-violet-600/30 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 4, suffix: "+", label: "Projects shipped" },
              { value: 150, suffix: "+", label: "Leads captured" },
              { value: 3, suffix: "", label: "Tech categories" },
              { value: 30, suffix: "%", label: "CPA reduction" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="font-mono text-4xl font-bold text-violet-400">
                  <AnimatedCounter targetValue={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
