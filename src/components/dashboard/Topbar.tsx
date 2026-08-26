"use client";

import Link from "next/link";
import { Menu, Bell, ExternalLink, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { resetDemo } = useApp();
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-sm border-b border-forest/10">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-forest p-1.5 -ml-1.5 rounded-lg hover:bg-forest/5"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => {
            if (confirming) {
              resetDemo();
              showToast("Demo reiniciada", { description: "Todos los datos volvieron a su estado inicial." });
              setConfirming(false);
            } else {
              setConfirming(true);
              setTimeout(() => setConfirming(false), 3000);
            }
          }}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/50 hover:text-forest px-2.5 py-1.5 rounded-lg hover:bg-forest/5 transition-colors"
        >
          <RotateCcw size={14} />
          {confirming ? "¿Confirmar reinicio?" : "Reiniciar demo"}
        </button>

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-forest px-3 py-1.5 rounded-lg border border-forest/15 hover:bg-forest/5 transition-colors"
        >
          Ver web pública <ExternalLink size={13} />
        </Link>

        <button className="relative text-charcoal/50 hover:text-forest p-1.5 rounded-lg hover:bg-forest/5" aria-label="Notificaciones">
          <Bell size={19} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold" />
        </button>

        <div className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
