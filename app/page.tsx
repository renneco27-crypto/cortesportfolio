import React from "react";
import ShowcaseRoot from "@/components/showcase/ShowcaseRoot";
import EditorialChatWidget from "@/components/ui/EditorialChatWidget";

export default function HomePage() {
  return (
    <>
      <ShowcaseRoot />
      {/* Global Interactive AI Chat Widget — z-[70] stays above showcase layers */}
      <EditorialChatWidget />
    </>
  );
}
