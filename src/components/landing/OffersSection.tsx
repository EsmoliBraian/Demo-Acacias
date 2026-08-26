"use client";

import { Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function OffersSection() {
  const { getFeaturedOffers, cabins } = useApp();
  const offers = getFeaturedOffers();
  if (offers.length === 0) return null;

  const referenceCabin = cabins.find((c) => c.id === "cabana-3") ?? cabins[0];

  return (
    <section className="py-16 sm:py-20 bg-forest">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-center text-xs tracking-[0.25em] uppercase text-gold mb-2">Ofertas especiales</p>
        <h2 className="text-center font-serif-display text-2xl sm:text-3xl text-cream mb-12">
          Aprovechá antes de que se terminen
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {offers.map((o) => {
            const before = referenceCabin.basePrice * Math.max(o.minNights, 2);
            const discount =
              o.type === "porcentaje"
                ? Math.round(before * (o.discountValue / 100))
                : o.type === "precio_fijo"
                ? o.discountValue
                : referenceCabin.basePrice;
            const after = before - discount;
            const label = o.type === "porcentaje" ? `${o.discountValue}% OFF` : o.type === "precio_fijo" ? `-${formatCurrency(o.discountValue)}` : "Noche gratis";

            return (
              <div key={o.id} className="relative bg-cream rounded-2xl p-6 shadow-xl">
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-gold text-charcoal text-[10px] font-bold px-3 py-1 rounded-full">
                  <Sparkles size={11} /> OFERTA ESPECIAL
                </span>
                <p className="font-serif-display text-xl text-forest mt-2 mb-1">{o.name}</p>
                <p className="text-sm text-charcoal/60 mb-4">{o.description}</p>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-2xl font-serif-display text-forest">{label}</span>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm text-charcoal/40 line-through">{formatCurrency(before)}</span>
                  <span className="text-lg font-semibold text-charcoal">{formatCurrency(after)}</span>
                </div>
                <a
                  href="#cabanas"
                  className="inline-flex mt-5 text-sm font-medium text-forest border border-forest/25 rounded-full px-5 py-2 hover:bg-forest/5 transition-colors"
                >
                  Ver oferta
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
