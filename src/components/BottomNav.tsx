"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Today", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/curriculum", label: "Curriculum", icon: "M4 6h2M4 12h2M4 18h2M9 6h11M9 12h11M9 18h11" },
  { href: "/careers", label: "Career", icon: "M9 6V4h6v2M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 13h18" },
];

export function BottomNav() {
  return <NavBar path={usePathname()} />;
}

/** Rendered with path=null in the static shell, so the bar is visible before the route streams in. */
export function NavBar({ path }: { path: string | null }) {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-2xl">
        {items.map((it) => {
          const active = path !== null && (it.href === "/" ? path === "/" : path.startsWith(it.href) || path.startsWith("/topic"));
          return (
            <li key={it.href} className="flex-1">
              <Link href={it.href} aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-sm font-medium ${active ? "text-accent" : "text-muted"}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={it.icon} /></svg>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
