"use client";

import { useEffect } from "react";

export default function WireframeMeshLoader() {
  useEffect(() => {
    // Ensure wireframe-active class is present on mount
    document.body.classList.add("wireframe-active");

    // Hold wireframe for exactly 1.0 second (1000ms), then reveal actual website
    const timer = setTimeout(() => {
      document.body.classList.remove("wireframe-active");
    }, 1000);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("wireframe-active");
    };
  }, []);

  return null;
}
