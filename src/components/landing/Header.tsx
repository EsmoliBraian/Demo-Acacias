"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#cabanas", label: "Cabañas" },
  { href: "#servicios", label: "Servicios" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export function Header({ onReserveClick }: { onReserveClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link href="#inicio" className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors",
              scrolled ? "border-forest/40 text-forest" : "border-gold/60 text-gold"
            )}
          >
            <Leaf size={16} />
          </div>
          <div className="leading-tight">
            <p className={cn("font-serif-display text-[15px] tracking-wide transition-colors", scrolled ? "text-forest" : "text-white")}>
              LAS ACACIAS
            </p>
            <p className={cn("text-[9px] tracking-[0.3em] transition-colors", scrolled ? "text-forest/60" : "text-white/70")}>
              CABAÑAS
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled ? "text-charcoal/70 hover:text-forest" : "text-white/90 hover:text-white"
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          onClick={onReserveClick}
          className={cn(
            "hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
            scrolled ? "bg-forest text-cream hover:bg-[#1c2c1b]" : "bg-white/95 text-forest hover:bg-white"
          )}
        >
          Reservar ahora
        </button>

        <button
          onClick={() => setMobileOpen(true)}
          className={cn("lg:hidden p-1.5", scrolled ? "text-forest" : "text-white")}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-forest lg:hidden animate-fade-in">
          <div className="flex items-center justify-between px-5 py-5">
            <span className="font-serif-display text-cream">Las Acacias</span>
            <button onClick={() => setMobileOpen(false)} className="text-cream/70" aria-label="Cerrar menú">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col items-start px-8 gap-6 mt-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-cream text-lg font-serif-display">
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onReserveClick();
              }}
              className="mt-4 bg-gold text-charcoal rounded-full px-6 py-3 text-sm font-medium"
            >
              Reservar ahora
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
