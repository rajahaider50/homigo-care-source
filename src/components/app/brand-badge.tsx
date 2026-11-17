import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

const WEBSITE_URL = "https://homigo-care-source.vercel.app";
const DISMISSED_KEY = "homigo-care-brand-badge-dismissed";

export function BrandBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(DISMISSED_KEY) !== "true");
    } catch {
      setVisible(true);
    }
  }, []);

  const openWebsite = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!Capacitor.isNativePlatform()) return;

    event.preventDefault();
    try {
      await Browser.open({ url: WEBSITE_URL });
    } catch {
      window.open(WEBSITE_URL, "_blank", "noopener,noreferrer");
    }
  };

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // The badge remains dismissed for the current page even when storage is unavailable.
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Homigo Care website link"
      className="fixed z-50 flex items-center gap-0.5 rounded-full border border-primary/10 bg-surface/95 p-1 shadow-float backdrop-blur-sm"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.25rem)",
        right: "max(12px, calc((100vw - 440px) / 2 + 12px))",
      }}
    >
      <a
        href={WEBSITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={openWebsite}
        aria-label="Open the Homigo Care website in your browser"
        className="press flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2 text-[13px] font-semibold text-primary-deep"
      >
        <img
          src="/favicon.png"
          alt=""
          aria-hidden="true"
          className="h-7 w-7 rounded-full bg-white object-contain p-0.5"
        />
        <span>Homigo Care</span>
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close Homigo Care website badge"
        title="Close"
        className="press grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
      >
        <X className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </aside>
  );
}
