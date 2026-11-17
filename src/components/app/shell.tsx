import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { ChevronLeft, House, FolderHeart, CalendarPlus, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/homigo-icon.png.asset.json";
import { cn } from "@/lib/utils";

export const logoUrl = logo.url;

export function PrototypeTag({ light }: { light?: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${light ? "bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/25" : "bg-accent-soft text-accent"}`}>
      Prototype
    </span>
  );
}

export function AppHeader({ title, subtitle, back = true, right, children }: { title: string; subtitle?: string; back?: boolean; right?: ReactNode; children?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="header-gradient pt-safe sticky top-0 z-20 rounded-b-[28px] px-4 pb-5 text-primary-foreground shadow-float">
      <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-2 pt-1">
        {back ? (
          <button aria-label="Back" onClick={() => router.history.back()} className="press grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/12 ring-1 ring-primary-foreground/20">
            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
          </button>
        ) : (
          <img src={logoUrl} alt="Homigo Care" className="h-10 w-10 rounded-xl bg-surface p-1" />
        )}
        <div className="min-w-0">
          <h1 className="truncate text-[19px] font-semibold">{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-primary-foreground/75">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">{right ?? <PrototypeTag light />}</div>
      </div>
      {children}
    </header>
  );
}

const tabs = [
  { to: "/", label: "Home", icon: House },
  { to: "/book", label: "Book", icon: CalendarPlus },
  { to: "/file", label: "Health File", icon: FolderHeart },
  { to: "/upload", label: "Pro", icon: UserRound },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
] as const;

export function TabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="pb-safe fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-border/70 bg-surface/90 backdrop-blur-xl">
      <ul className="grid grid-cols-5 px-1 pt-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <li key={to}>
              <Link to={to} className={`press flex flex-col items-center gap-1 py-1 text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                <span className={`grid h-8 w-12 place-items-center rounded-full transition-colors ${active ? "bg-primary-soft" : ""}`}>
                  <Icon className={`h-[22px] w-[22px] transition-transform ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.4 : 1.9} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="animate-screen space-y-4 px-4 pb-32 pt-4">{children}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-card p-4 shadow-card", className)}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1 pt-1">
      <h2 className="text-[17px] font-semibold text-primary-deep">{children}</h2>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, className = "", tone = "accent", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "accent" | "primary" | "outline" | "danger" }) {
  const tones = {
    accent: "accent-gradient text-accent-foreground shadow-accent",
    primary: "bg-primary text-primary-foreground",
    outline: "bg-surface text-primary-deep ring-1 ring-border",
    danger: "bg-destructive-soft text-destructive",
  };
  return <button {...p} className={`press flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold ${tones[tone]} ${className}`}>{children}</button>;
}

export type Tier = "Gold" | "Silver" | "Verified";
export function TierBadge({ tier }: { tier: Tier }) {
  const map = { Gold: "bg-accent-soft text-accent", Silver: "bg-primary-soft text-primary", Verified: "bg-success-soft text-success" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${map[tier]}`}>
      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.6} /> {tier} tier
    </span>
  );
}

export function Avatar({ initials, tone = "primary", size = 48 }: { initials: string; tone?: "primary" | "accent" | "success"; size?: number }) {
  const map = { primary: "bg-primary-soft text-primary", accent: "bg-accent-soft text-accent", success: "bg-success-soft text-success" };
  return <div style={{ width: size, height: size }} className={`grid shrink-0 place-items-center rounded-full font-display text-[15px] font-semibold ring-2 ring-surface ${map[tone]}`}>{initials}</div>;
}
