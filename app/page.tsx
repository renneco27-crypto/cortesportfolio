"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import NodeCanvas from "@/components/ui/NodeCanvas";
import PixelTransition from "@/components/ui/PixelTransition";
import SwissNavbar from "@/components/layout/SwissNavbar";
import EditorialHero from "@/components/sections/EditorialHero";
import EditorialAbout from "@/components/sections/EditorialAbout";
import MistralSlideSection from "@/components/sections/MistralSlideSection";
import EditorialProjects from "@/components/sections/EditorialProjects";
import EditorialContact from "@/components/sections/EditorialContact";

export default function HomePage() {
  const [contactTurnstileToken, setContactTurnstileToken] = useState<string | null>(null);
  const [contactSubmissionsLeft, setContactSubmissionsLeft] = useState<number | null>(null);

  // Fetch remaining contact submissions on mount
  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.submissionsLeft === "number") {
          setContactSubmissionsLeft(data.submissionsLeft);
        }
      })
      .catch(() => {});
  }, []);

  // Expose contact-form Turnstile callbacks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onContactTurnstileSuccess = (token: string) => {
      setContactTurnstileToken(token);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onContactTurnstileExpired = () => {
      setContactTurnstileToken(null);
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onContactTurnstileSuccess;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onContactTurnstileExpired;
    };
  }, []);

  return (
    <>
      {/* Cloudflare Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="lazyOnload"
      />

      {/* Global Interactive Node Canvas Background */}
      <NodeCanvas particleCount={70} connectionDistance={130} mouseDistance={170} />

      {/* Swiss Minimalist Navigation */}
      <SwissNavbar />

      <main className="relative z-10 w-full min-h-screen bg-transparent flex flex-col">
        {/* Editorial Architectural Hero with Inline Terminal Blinker */}
        <EditorialHero />

        {/* Procedural Pixel Teeth Parallax Transition */}
        <PixelTransition id="pixel-transition" text="[ ARCHITECTURAL ENGINE ]" />

        {/* Editorial Biography & Capabilities */}
        <EditorialAbout />

        {/* Mistral-Style Kinetic 2D PowerPoint Physics Slides */}
        <MistralSlideSection />

        {/* Selected Engineering Projects & Blueprint Lightbox */}
        <EditorialProjects />

        {/* Reverse Pixel Teeth Bridge */}
        <PixelTransition id="reverse-pixel-transition" reverse={true} />

        {/* High-Contrast Swiss Contact Sheet */}
        <EditorialContact
          contactTurnstileToken={contactTurnstileToken}
          setContactTurnstileToken={setContactTurnstileToken}
          contactSubmissionsLeft={contactSubmissionsLeft}
        />

        {/* Minimalist Editorial Footer */}
        <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-12 px-6 md:px-16 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-[#666] select-none gap-4">
          <div>
            &copy; {new Date().getFullYear()} LAWRENCE MANZO CORTES. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 uppercase">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#stack" className="hover:text-white transition-colors">Manifesto</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-[#e63946] hover:underline">Back to Top &uarr;</a>
          </div>
        </footer>
      </main>
    </>
  );
}