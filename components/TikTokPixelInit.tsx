"use client";

import { useEffect } from "react";
import { tiktokPixelHelper } from "@/lib/tiktok-pixel";

export default function TikTokPixelInit() {
  useEffect(() => {
    tiktokPixelHelper.init();
    tiktokPixelHelper.trackPageView();
  }, []);

  return null;
}
