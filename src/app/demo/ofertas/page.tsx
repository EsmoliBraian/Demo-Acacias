"use client";

import { useState } from "react";
import { Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OfferStatusBadge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Field";
import { OfferFormModal } from "@/components/ofertas/OfferFormModal";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function OfertasPage() {
  const { offers, cabins, toggleOfferStatus } = useApp();
  const [createOpen, setCreateOpen] = useState(false);

  const sorted = [...offers].sort((a, b) => Number(b.featured) - Number(a.featured) || a.priority - b.priority);

  const discountLabel = (o: (typeof offers)[number]) =>
    o.type === "porcentaje" ? `${o.discountValue}% OFF` : o.type === "precio_fijo" ? `-$${o.discountValue.toLocaleString("es-AR")}` : "Noche gratis";

  return (
    <div>
      <PageHeader
        title="Ofertas y promociones"
        subtitle="Las ofertas destacadas y activas se muestran automáticamente en la web pública"
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
            Crear oferta
          </Button>
        }
      />

      <div className="space-y-4">
        {sorted.map((o) => (
          <Card key={o.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {o.featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8a7940] bg-gold/20 px-2 py-0.5 rounded-full">
                      <Star size={10} fill="currentColor" /> DESTACADA · P{o.priority}
                    </span>
                  )}
                  <OfferStatusBadge status={o.status} />
                </div>
                <h3 className="font-serif-display text-lg text-forest">{o.name}</h3>
                <p className="text-sm text-charcoal/60 mt-0.5">{o.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-charcoal/50">
                  <span>
                    Vigencia: {formatDate(o.startDate)} — {formatDate(o.endDate)}
                  </span>
                  <span>
                    Cabañas: {o.applicableCabinIds === "all" ? "Todas" : o.applicableCabinIds.map((id) => cabins.find((c) => c.id === id)?.name).join(", ")}
                  </span>
                  <span>Mín. {o.minNights} noches</span>
                  <span>{o.timesUsed} usos</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xl font-serif-display text-forest">{discountLabel(o)}</span>
                <Switch checked={o.status === "Activa"} onChange={() => toggleOfferStatus(o.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <OfferFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
