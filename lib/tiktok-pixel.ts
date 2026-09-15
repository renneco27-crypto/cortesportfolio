type TikTokWindow = Window & {
  ttq?: {
    load?: (pixelId: string) => void;
    track?: (event: string, params?: Record<string, unknown>) => void;
  };
};

const getTikTokWindow = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window as TikTokWindow;
};

export const tiktokPixelHelper = {
  init: (pixelId?: string) => {
    const win = getTikTokWindow();
    if (!win?.ttq || !pixelId) {
      return;
    }

    win.ttq.load?.(pixelId);
  },
  trackPageView: (data?: Record<string, unknown>) => {
    const win = getTikTokWindow();
    if (!win?.ttq) {
      return;
    }

    win.ttq.track?.("PageView", data);
  },
  trackEvent: (event: string, data?: Record<string, unknown>) => {
    const win = getTikTokWindow();
    if (!win?.ttq) {
      return;
    }

    win.ttq.track?.(event, data);
  },
  serverSideEvent: async (event: string, data: Record<string, unknown>) => {
    try {
      await fetch("https://business-api.tiktok.com/open_api/v1.3/pixel/track/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          ...data,
        }),
      });
    } catch {
      // swallow TikTok pixel errors in production
    }
  },
};

export const initTikTokPixel = (pixelId?: string) => tiktokPixelHelper.init(pixelId);
export const trackTikTokEvent = (event: string, data?: Record<string, unknown>) =>
  tiktokPixelHelper.trackEvent(event, data);
