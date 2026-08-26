"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, X } from "lucide-react";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center text-gold shrink-0">
          <Leaf size={16} />
        </div>
        <div className="leading-tight">
          <p className="font-serif-display text-cream text-[15px]">Las Acacias</p>
          <p className="text-[10px] text-cream/45 tracking-[0.2em] uppercase">Cabañas</p>
        </div>
        <span className="ml-auto text-[9px] font-bold tracking-widest text-charcoal bg-gold px-1.5 py-0.5 rounded">
          DEMO
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto scroll-thin px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150",
                active
                  ? "bg-cream text-forest font-semibold shadow-sm"
                  : "text-cream/65 hover:text-cream hover:bg-white/8"
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-[11px] text-cream/40 leading-relaxed">
          Propuesta comercial interactiva.
          <br />
          Todos los datos son simulados.
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-forest h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-charcoal/50 animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-forest animate-slide-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-4 text-cream/60 hover:text-cream"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
