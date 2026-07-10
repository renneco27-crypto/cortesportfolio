"use client";
import Link from "next/link";
import { GitFork, Menu, X, FileDown } from "lucide-react";
import { useState } from "react";
import type { NavLink } from "@/types";

interface NavbarProps {
  links: NavLink[];
  resumeDownloadUrl: string;
}

export default function NavbarComponent({ links, resumeDownloadUrl }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-semibold text-violet-400 tracking-widest uppercase">
          LC.dev
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/renneco27-crypto/CORTES-Engineering-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-zinc-400 hover:text-violet-400 transition-colors duration-200"
          >
            <GitFork size={20} />
          </a>
          <a
            href={resumeDownloadUrl}
            download
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors duration-200"
          >
            <FileDown size={14} />
            Resume
          </a>
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-300 hover:text-violet-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/renneco27-crypto/CORTES-Engineering-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-violet-400"
          >
            <GitFork size={16} /> GitHub
          </a>
          <a
            href={resumeDownloadUrl}
            download
            className="flex items-center gap-2 text-sm text-violet-400"
          >
            <FileDown size={16} /> Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
