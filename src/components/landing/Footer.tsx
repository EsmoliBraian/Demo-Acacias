"use client";

import Link from "next/link";
import { Leaf, Camera, MessageCircle, Mail } from "lucide-react";
import { useApp } from "@/lib/store";

export function Footer() {
  const { settings } = useApp();

  return (
    <footer className="bg-charcoal py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center text-gold">
              <Leaf size={16} />
            </div>
            <div className="leading-tight">
              <p className="font-serif-display text-cream text-[15px]">Las Acacias</p>
              <p className="text-[9px] text-cream/40 tracking-[0.3em]">CABAÑAS</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-cream/50">
            <a href="#cabanas" className="hover:text-cream transition-colors">
              Cabañas
            </a>
            <a href="#servicios" className="hover:text-cream transition-colors">
              Servicios
            </a>
            <a href="#ubicacion" className="hover:text-cream transition-colors">
              Ubicación
            </a>
            <Link href="/demo/dashboard" className="hover:text-cream transition-colors">
              Panel administrativo
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <SocialIcon icon={Camera} />
            <SocialIcon icon={Mail} />
            <SocialIcon icon={MessageCircle} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-cream/35">
          <p>Naturaleza, confort y tecnología para crear experiencias inolvidables.</p>
          <p>{settings.complexInfo.email}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: { icon: typeof Camera }) {
  return (
    <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-cream/60 hover:text-cream hover:border-white/30 transition-colors cursor-pointer">
      <Icon size={14} />
    </span>
  );
}
