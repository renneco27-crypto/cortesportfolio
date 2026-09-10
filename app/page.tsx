import React from "react";
import SwissNavbar from "@/components/layout/SwissNavbar";
import EditorialHero from "@/components/sections/EditorialHero";
import EditorialAbout from "@/components/sections/EditorialAbout";
import EditorialGitHub from "@/components/sections/EditorialGitHub";
import NodeCanvas from "@/components/ui/NodeCanvas";
import PixelTransition from "@/components/ui/PixelTransition";
import EditorialChatWidget from "@/components/ui/EditorialChatWidget";
import SectionWipeTransitions from "@/components/sections/MistralSlideSection";

export default function EditorialPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white relative">
      <NodeCanvas />
      <SwissNavbar />

      {/* Pure GSAP wipe transitions — renders null, attaches translucent clip-path overlays between sections */}
      <SectionWipeTransitions />

      <div className="relative z-10 flex flex-col items-center">
        {/* Hero */}
        <div className="w-full flex justify-center pt-24 pb-8">
          <EditorialHero />
        </div>

        {/* bg-image Pixel Reveal */}
        <div className="w-full relative z-20 bg-transparent">
          <PixelTransition />

          {/* About section */}
          <EditorialAbout />

          {/* GitHub Development Activity section immediately following About */}
          <EditorialGitHub />

          {/* 1px tiny gap ensuring GitHub is fully clickthrough & hoverable */}
          <section className="w-full h-[1px] bg-transparent pointer-events-none select-none" id="slide-trigger-gap" aria-hidden="true" />

          {/* Master Trigger Section — combines Wipe 1 & Wipe 2 into 1 single continuous scrub timeline with zero gaps */}
          <section className="w-full h-[240vh] bg-transparent pointer-events-none select-none" id="slide-trigger-master" aria-hidden="true" />
        </div>
      </div>

      {/* Global Interactive Chat Widget — z-[70] stays above wipe overlays */}
      <EditorialChatWidget />
    </main>
  );
}