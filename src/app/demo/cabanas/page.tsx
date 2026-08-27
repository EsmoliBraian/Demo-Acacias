"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, BedDouble, Bath } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { CabinStatusBadge } from "@/components/ui/Badge";
import { CabinDetailModal } from "@/components/cabanas/CabinDetailModal";
import { useApp } from "@/lib/store";
import { assetPath, formatCurrency } from "@/lib/utils";

export default function CabanasPage() {
  const { cabins, offers } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const cabin = cabins.find((c) => c.id === selected);

  return (
    <div>
      <PageHeader title="Cabañas" subtitle={`${cabins.length} unidades en el complejo`} />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cabins.map((c) => {
          const offer = offers.find(
            (o) => o.status === "Activa" && (o.applicableCabinIds === "all" || o.applicableCabinIds.includes(c.id))
          );
          return (
            <button key={c.id} onClick={() => setSelected(c.id)} className="text-left">
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative h-44">
                  <Image
                    src={assetPath(c.images[0])}
                    alt={c.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <CabinStatusBadge status={c.status} />
                  </div>
                  {offer && (
                    <div className="absolute top-3 right-3 bg-gold text-charcoal text-[10px] font-bold px-2 py-1 rounded-full">
                      OFERTA
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif-display text-lg text-forest mb-2">{c.name}</h3>
                  <div className="flex items-center gap-3.5 text-xs text-charcoal/55 mb-3">
                    <span className="flex items-center gap-1">
                      <Users size={13} /> {c.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble size={13} /> {c.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={13} /> {c.bathrooms}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-charcoal/45">desde</span>
                    <span className="font-serif-display text-lg text-charcoal">{formatCurrency(c.basePrice)}</span>
                  </div>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      <CabinDetailModal cabin={cabin} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
