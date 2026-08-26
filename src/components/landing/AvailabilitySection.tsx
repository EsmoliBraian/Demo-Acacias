"use client";

import { CabinCard } from "./CabinCard";
import { useApp } from "@/lib/store";
import { nightsBetween } from "@/lib/utils";
import type { SearchCriteria } from "./Hero";

export function AvailabilitySection({
  searched,
  criteria,
  onSelectCabin,
}: {
  searched: boolean;
  criteria: SearchCriteria;
  onSelectCabin: (cabinId: string) => void;
}) {
  const { cabins, reservations } = useApp();

  const nights = criteria.checkIn && criteria.checkOut ? nightsBetween(criteria.checkIn, criteria.checkOut) : 0;

  const list = searched
    ? cabins.filter((c) => {
        if (c.status === "Inactiva" || c.status === "Mantenimiento") return false;
        if (c.capacity < criteria.guests) return false;
        if (!criteria.checkIn || !criteria.checkOut) return true;
        const overlaps = reservations.some(
          (r) =>
            r.cabinId === c.id &&
            r.status !== "Cancelada" &&
            r.checkIn < criteria.checkOut &&
            r.checkOut > criteria.checkIn
        );
        return !overlaps;
      })
    : cabins;

  return (
    <section id="cabanas" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-olive mb-3">Nuestras cabañas</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-forest mb-3">
            {searched ? "Cabañas disponibles" : "Cada cabaña, un refugio distinto"}
          </h2>
          {searched && (
            <p className="text-sm text-charcoal/55">
              {list.length} cabaña{list.length === 1 ? "" : "s"} disponible{list.length === 1 ? "" : "s"}
              {nights > 0 ? ` para ${nights} noche${nights === 1 ? "" : "s"}` : ""} · {criteria.guests} huéspedes
            </p>
          )}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-charcoal/50 text-sm">
            No encontramos cabañas disponibles para esas fechas. Probá con otro rango.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((c) => (
              <CabinCard key={c.id} cabin={c} checkIn={criteria.checkIn} checkOut={criteria.checkOut} onSelect={onSelectCabin} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
