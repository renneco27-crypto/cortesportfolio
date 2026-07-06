import { GitFork, Mail } from "lucide-react";

export default function FooterComponent() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="font-mono text-xs text-zinc-500">
          © 2025 Lawrence Cortes — Cebu, PH
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-zinc-500 hover:text-violet-400 transition-colors"
          >
            <GitFork size={18} />
          </a>
          <a
            href="mailto:renneco27@gmail.com"
            aria-label="Email"
            className="text-zinc-500 hover:text-violet-400 transition-colors"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
