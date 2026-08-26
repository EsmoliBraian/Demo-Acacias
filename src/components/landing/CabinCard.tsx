"use client";

import Image from "next/image";
import { Users, BedDouble, Bath } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { formatCurrency, nightsBetween } from "@/lib/utils";
import type { Cabin } from "@/lib/types";

export function CabinCard({
  cabin,
  checkIn,
  checkOut,
  onSelect,
}: {
  cabin: Cabin;
  checkIn?: string;
  checkOut?: string;
  onSelect: (cabinId: string) => void;
}) {
  const { getActiveOffersForCabin } = useApp();
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const offers = getActiveOffersForCabin(cabin.id).filter((o) => nights === 0 || nights >= o.minNights);
  const offer = offers[0];

  const subtotal = cabin.basePrice * Math.max(nights, 1);
  let discount = 0;
  if (offer) {
    if (offer.type === "porcentaje") discount = Math.round(subtotal * (offer.discountValue / 100));
    else if (offer.type === "precio_fijo") discount = Math.min(offer.discountValue, subtotal);
    else discount = cabin.basePrice;
  }
  const final = subtotal - discount;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-forest/8 hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-52">
        <Image src={cabin.images[0]} alt={cabin.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
        {offer && (
          <span className="absolute top-3 right-3 bg-gold text-charcoal text-[10px] font-bold px-2.5 py-1 rounded-full">
            {offer.type === "porcentaje" ? `${offer.discountValue}% OFF` : offer.type === "noche_gratis" ? "NOCHE GRATIS" : "OFERTA"}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif-display text-xl text-forest mb-2">{cabin.name}</h3>
        <div className="flex items-center gap-4 text-xs text-charcoal/55 mb-3">
          <span className="flex items-center gap-1">
            <Users size={13} /> {cabin.capacity} huéspedes
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={13} /> {cabin.bedrooms} hab.
          </span>
          <span className="flex items-center gap-1">
            <Bath size={13} /> {cabin.bathrooms} baños
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {cabin.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-[11px] bg-forest/6 text-forest/75 rounded-full px-2 py-0.5">
              {a}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between border-t border-forest/8 pt-4">
          <div>
            {nights > 0 ? (
              <>
                {offer && <p className="text-xs text-charcoal/40 line-through">{formatCurrency(subtotal)}</p>}
                <p className="font-serif-display text-xl text-charcoal">{formatCurrency(final)}</p>
                <p className="text-[11px] text-charcoal/45">{nights} noches</p>
              </>
            ) : (
              <>
                <p className="text-[11px] text-charcoal/45">desde</p>
                <p className="font-serif-display text-xl text-charcoal">{formatCurrency(cabin.basePrice)}</p>
                <p className="text-[11px] text-charcoal/45">por noche</p>
              </>
            )}
          </div>
          <Button size="sm" onClick={() => onSelect(cabin.id)}>
            Elegir cabaña
          </Button>
        </div>
      </div>
    </div>
  );
}
