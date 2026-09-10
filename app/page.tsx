import React from "react";
import Link from "next/link";
import SwissNavbar from "@/components/layout/SwissNavbar";
import EditorialHero from "@/components/sections/EditorialHero";
import EditorialGitHub from "@/components/sections/EditorialGitHub";
import EditorialAbout from "@/components/sections/EditorialAbout";
import EditorialContact from "@/components/sections/EditorialContact";
import NodeCanvas from "@/components/ui/NodeCanvas";
import PixelTransition from "@/components/ui/PixelTransition";
import EditorialChatWidget from "@/components/ui/EditorialChatWidget";
import { ArrowUpRight, FolderGit2 } from "lucide-react";

export default function EditorialPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white relative">
      <NodeCanvas />
      
      <SwissNavbar />

      <div className="relative z-10 flex flex-col items-center">
        {/* Fixed Hero Background */}
        <div className="w-full flex justify-center sticky top-0 h-screen -z-10 pointer-events-none">
          <EditorialHero />
        </div>

        {/* Scrolling Content Below Hero */}
        <div className="w-full mt-[100vh] relative z-20 bg-[#050505]">
          <PixelTransition />
          
          <EditorialGitHub />
          <EditorialAbout />
          
          {/* Projects Gateway Banner */}
          <section className="w-full bg-[#050505] py-20 px-6 md:px-16 border-t border-[#1a1a1a] select-none">
            <div className="max-w-6xl mx-auto">
              <div className="p-8 md:p-12 bg-[#090909] border border-[#222] rounded-[2px] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-[#444] transition-all">
                <div className="space-y-3">
                  <div className="font-mono text-xs tracking-widest text-[#e63946] uppercase">
                    [ 02 // ARCHITECTURAL SCHEMATICS &amp; WORKS ]
                  </div>
                  <h2 className="text-3xl md:text-5xl font-light tracking-tight uppercase text-white">
                    Selected Engineering Works
                  </h2>
                  <p className="text-[#888] text-sm md:text-base font-light max-w-xl">
                    Explore detailed blueprints, live demos, telemetry, and source repositories across AI systems, EdTech, automation, and web security.
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="font-mono text-xs uppercase tracking-widest bg-white text-black font-bold px-8 py-4 flex items-center gap-2.5 hover:bg-[#d4d4d8] transition-colors shrink-0"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Explore Projects Gallery</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          <EditorialContact />
        </div>
      </div>
      
      {/* Global Widgets */}
      <EditorialChatWidget />
    </main>
  );
}