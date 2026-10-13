"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function SwissNavbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-[60px] z-50 flex justify-between items-center px-6 md:px-10 bg-[#050505]/90 backdrop-blur-[14px] border-b border-[#1a1a1a] select-none">
      {/* Brand / Logo */}
      <Link
        href="/"
        className="font-mono text-xs md:text-sm font-bold tracking-[2px] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span>LAWRENCE MANZO CORTES</span>
        <span className="text-[#e63946] font-normal text-xs tracking-wider">/ PORTFOLIO</span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-7 text-[0.8rem] uppercase tracking-[1.5px] text-[#888888]">
        <Link href="/#about" className="hover:text-white transition-colors duration-200">
          About
        </Link>
        <Link href="/#stack" className="hover:text-white transition-colors duration-200">
          Architecture
        </Link>
        <Link href="/projects" className="text-white hover:text-[#e63946] font-medium transition-colors duration-200 flex items-center gap-1.5">
          <span>Projects</span>
          <span className="text-[0.68rem] text-[#e63946] font-mono">[SYS]</span>
        </Link>
        <Link href="/#contact" className="hover:text-white transition-colors duration-200">
          Contact
        </Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <a
          href="/resume/lawrence-cortes-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume</span>
          <ArrowUpRight className="w-3 h-3 opacity-70" />
        </a>

        <a
          href="https://github.com/renneco27-crypto"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-[2px] border border-[#222] bg-[#161616] hover:border-white hover:bg-white hover:text-black text-[#aaa] flex items-center justify-center transition-all duration-200"
          aria-label="GitHub Profile"
        >
          <GithubIcon className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
