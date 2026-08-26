"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useApp } from "@/lib/store";

export function LocationSection() {
  const { settings } = useApp();
  const { complexInfo } = settings;

  return (
    <section id="ubicacion" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-olive mb-3">Ubicación</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-forest mb-6 leading-tight">
            Cerca de todo, lejos del ruido
          </h2>
          <div id="contacto" className="space-y-4">
            <InfoRow icon={MapPin} label="Dirección" value={complexInfo.address} />
            <InfoRow icon={Phone} label="Teléfono" value={complexInfo.phone} />
            <InfoRow icon={MessageCircle} label="WhatsApp" value={`+${complexInfo.whatsapp}`} />
            <InfoRow icon={Mail} label="Email" value={complexInfo.email} />
            <InfoRow icon={Clock} label="Atención" value={complexInfo.hours} />
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden min-h-[320px] bg-forest">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(181,165,106,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(89,103,71,0.5), transparent 50%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <MapPin size={30} className="text-gold mb-3" />
            <p className="text-cream font-serif-display text-lg">{complexInfo.address}</p>
            <p className="text-cream/50 text-xs mt-2 uppercase tracking-wide">Mapa ilustrativo — demo</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-full bg-forest/8 text-forest flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] text-charcoal/45 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-charcoal">{value}</p>
      </div>
    </div>
  );
}
