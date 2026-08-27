"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, BedDouble, Bath, Pencil } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CabinStatusBadge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { UpdatePriceModal } from "./UpdatePriceModal";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { assetPath, formatCurrency, formatDateTime } from "@/lib/utils";
import type { Cabin, CabinStatus } from "@/lib/types";

const priceRows: { key: "base" | "finde" | "temporada_alta" | "temporada_baja"; label: string; field: keyof Cabin }[] = [
  { key: "base", label: "Precio base", field: "basePrice" },
  { key: "finde", label: "Fin de semana", field: "weekendPrice" },
  { key: "temporada_alta", label: "Temporada alta", field: "highSeasonPrice" },
  { key: "temporada_baja", label: "Temporada baja", field: "lowSeasonPrice" },
];

const statuses: CabinStatus[] = ["Disponible", "Ocupada", "Mantenimiento", "Inactiva"];

export function CabinDetailModal({
  cabin,
  open,
  onClose,
}: {
  cabin: Cabin | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { priceHistory, updateCabinStatus, offers } = useApp();
  const { showToast } = useToast();
  const [priceType, setPriceType] = useState<null | "base" | "finde" | "temporada_alta" | "temporada_baja">(null);

  if (!open || !cabin) return null;

  const history = priceHistory.filter((p) => p.cabinId === cabin.id).slice(0, 6);
  const activeOffer = offers.find(
    (o) => o.status === "Activa" && (o.applicableCabinIds === "all" || o.applicableCabinIds.includes(cabin.id))
  );

  return (
    <>
      <Modal open={open} onClose={onClose} size="lg" title={cabin.name}>
        <div className="grid grid-cols-2 gap-2 mb-5 rounded-xl overflow-hidden">
          {cabin.images.map((img, i) => (
            <div key={img} className={`relative h-40 ${i === 0 ? "col-span-2 h-52" : ""}`}>
              <Image src={assetPath(img)} alt={cabin.name} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <CabinStatusBadge status={cabin.status} />
          {activeOffer && (
            <span className="text-[11px] font-semibold text-[#8a7940] bg-gold/20 px-2.5 py-1 rounded-full">
              ⭐ {activeOffer.name}
            </span>
          )}
        </div>

        <p className="text-sm text-charcoal/70 leading-relaxed mb-4">{cabin.description}</p>

        <div className="flex items-center gap-5 text-sm text-charcoal/60 mb-5">
          <span className="flex items-center gap-1.5">
            <Users size={15} /> {cabin.capacity} huéspedes
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble size={15} /> {cabin.bedrooms} hab.
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={15} /> {cabin.bathrooms} baños
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {cabin.amenities.map((a) => (
            <span key={a} className="text-xs bg-forest/6 text-forest/80 rounded-full px-2.5 py-1">
              {a}
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-forest/10 p-4 mb-4">
          <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Precios</p>
          <div className="space-y-2.5">
            {priceRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between text-sm">
                <span className="text-charcoal/60">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-charcoal font-medium">{formatCurrency(cabin[row.field] as number)}</span>
                  <button
                    onClick={() => setPriceType(row.key)}
                    className="text-forest/40 hover:text-forest p-1 rounded-md hover:bg-forest/8"
                    aria-label={`Modificar ${row.label}`}
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-forest/10 p-4 mb-4">
          <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Estado de la cabaña</p>
          <Select
            value={cabin.status}
            onChange={(e) => {
              const status = e.target.value as CabinStatus;
              updateCabinStatus(cabin.id, status, "Actualización manual desde panel de cabañas");
              showToast(`${cabin.name} ahora está ${status.toLowerCase()}.`);
            }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        {history.length > 0 && (
          <div className="rounded-xl border border-forest/10 p-4">
            <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Historial de precios</p>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="text-sm">
                  <p className="text-charcoal">
                    {formatCurrency(h.before)} → {formatCurrency(h.after)}
                  </p>
                  <p className="text-xs text-charcoal/45">
                    {formatDateTime(h.date)} · {h.user} · {h.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <UpdatePriceModal cabin={cabin} priceType={priceType} open={!!priceType} onClose={() => setPriceType(null)} />
    </>
  );
}
