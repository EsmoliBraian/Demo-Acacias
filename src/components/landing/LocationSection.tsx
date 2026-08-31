"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from "lucide-react";
import { useApp } from "@/lib/store";

export function LocationSection() {
  const { settings } = useApp();
  const { complexInfo } = settings;
  const embedSrc = `https://www.google.com/maps?q=${complexInfo.mapsLat},${complexInfo.mapsLng}&z=15&output=embed`;

  return (
    <section id="ubicacion" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-olive mb-3">Ubicación</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-forest mb-6 leading-tight">
            Cerca de todo, lejos del ruido
          </h2>
          <div id="contacto" className="space-y-4 mb-6">
            <InfoRow icon={MapPin} label="Dirección" value={complexInfo.address} />
            <InfoRow icon={Phone} label="Teléfono" value={complexInfo.phone} />
            <InfoRow icon={MessageCircle} label="WhatsApp" value={`+${complexInfo.whatsapp}`} />
            <InfoRow icon={Mail} label="Email" value={complexInfo.email} />
            <InfoRow icon={Clock} label="Atención" value={complexInfo.hours} />
          </div>
          <a
            href={complexInfo.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest border border-forest/25 rounded-full px-5 py-2.5 hover:bg-forest/5 transition-colors"
          >
            <Navigation size={15} /> Cómo llegar
          </a>
        </div>

        <div className="relative rounded-2xl overflow-hidden min-h-[320px] bg-forest">
          <iframe
            src={embedSrc}
            title="Ubicación de Las Acacias Cabañas"
            className="absolute inset-0 w-full h-full grayscale-[15%] contrast-[1.05]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
