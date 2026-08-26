"use client";

import { Mail, Phone, ArrowLeftRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ReservationStatusBadge } from "@/components/ui/Badge";
import { useApp } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { Guest } from "@/lib/types";

export function GuestProfileModal({
  guest,
  open,
  onClose,
}: {
  guest: Guest | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { reservations, getCabin } = useApp();
  const { openReservation } = useUI();

  if (!open || !guest) return null;

  const guestReservations = reservations
    .filter((r) => r.guestId === guest.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const totalSpent = guestReservations
    .filter((r) => r.status !== "Cancelada")
    .reduce((sum, r) => sum + r.total, 0);

  const movements = guestReservations.flatMap((r) => r.cabinChanges.map((c) => ({ ...c, reservationId: r.id })));

  return (
    <Modal open={open} onClose={onClose} size="lg" title={`${guest.firstName} ${guest.lastName}`}>
      <div className="flex flex-wrap gap-4 text-sm text-charcoal/70 mb-6">
        <span className="flex items-center gap-1.5">
          <Mail size={14} /> {guest.email}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone size={14} /> {guest.phone}
        </span>
        <span className="text-charcoal/40">Cliente desde {formatDate(guest.createdAt)}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-forest/10 p-3.5 text-center">
          <p className="font-serif-display text-xl text-forest">{guestReservations.length}</p>
          <p className="text-[11px] text-charcoal/50 uppercase tracking-wide mt-0.5">Reservas</p>
        </div>
        <div className="rounded-xl border border-forest/10 p-3.5 text-center">
          <p className="font-serif-display text-xl text-forest">{formatCurrency(totalSpent)}</p>
          <p className="text-[11px] text-charcoal/50 uppercase tracking-wide mt-0.5">Total gastado</p>
        </div>
        <div className="rounded-xl border border-forest/10 p-3.5 text-center">
          <p className="font-serif-display text-xl text-forest">
            {guestReservations[0] ? formatDate(guestReservations[0].checkIn) : "—"}
          </p>
          <p className="text-[11px] text-charcoal/50 uppercase tracking-wide mt-0.5">Última estadía</p>
        </div>
      </div>

      <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Reservas</p>
      <div className="space-y-2 mb-6">
        {guestReservations.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              onClose();
              openReservation(r.id);
            }}
            className="w-full flex items-center justify-between gap-3 rounded-xl border border-forest/10 px-4 py-3 hover:bg-forest/[0.03] text-left"
          >
            <div>
              <p className="text-sm font-medium text-charcoal">{getCabin(r.cabinId)?.name}</p>
              <p className="text-xs text-charcoal/45">
                {r.id} · {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
              </p>
            </div>
            <ReservationStatusBadge status={r.status} />
          </button>
        ))}
      </div>

      {movements.length > 0 && (
        <>
          <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Movimientos</p>
          <div className="space-y-2.5">
            {movements.map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 text-sm">
                <ArrowLeftRight size={14} className="text-sky-700 shrink-0" />
                <span className="text-charcoal">
                  {getCabin(m.fromCabinId)?.name} → {getCabin(m.toCabinId)?.name}
                </span>
                <span className="text-xs text-charcoal/40 ml-auto">{formatDateTime(m.date)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
