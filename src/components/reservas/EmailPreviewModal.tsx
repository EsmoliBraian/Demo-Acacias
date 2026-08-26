"use client";

import { useState } from "react";
import { Mail, Leaf, MapPin, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { emailTemplateCopy } from "@/data/emailTemplates";
import type { EmailLogEntry, Reservation } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function EmailPreviewModal({
  reservation,
  type,
  open,
  onClose,
}: {
  reservation: Reservation | undefined;
  type: EmailLogEntry["type"] | null;
  open: boolean;
  onClose: () => void;
}) {
  const { getCabin, settings } = useApp();
  const [view, setView] = useState<"email" | "summary">("email");

  if (!open || !reservation || !type) return null;
  const cabin = getCabin(reservation.cabinId);
  const copy = emailTemplateCopy[type];
  const firstName = reservation.guestFirstName;

  return (
    <Modal
      open={open}
      onClose={() => {
        setView("email");
        onClose();
      }}
      size="lg"
      title={view === "email" ? "Vista previa de email" : "Resumen de tu reserva"}
      subtitle={view === "email" ? `${copy.subjectPrefix} — Las Acacias | ${reservation.id}` : reservation.id}
    >
      {view === "email" ? (
        <div className="rounded-2xl border border-forest/10 overflow-hidden bg-white">
          <div className="bg-charcoal/[0.03] px-5 py-3 border-b border-forest/10 text-xs text-charcoal/60 space-y-1">
            <p>
              <span className="text-charcoal/40">De:</span> {settings.complexInfo.name} &lt;{settings.complexInfo.email}&gt;
            </p>
            <p>
              <span className="text-charcoal/40">Para:</span> {reservation.guestEmail}
            </p>
            <p>
              <span className="text-charcoal/40">Asunto:</span>{" "}
              <strong className="text-charcoal">
                {copy.subjectPrefix} — Las Acacias | {reservation.id}
              </strong>
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-cream">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center text-gold">
                <Leaf size={14} />
              </div>
              <span className="font-serif-display text-forest text-sm">Las Acacias Cabañas</span>
            </div>

            <h3 className="font-serif-display text-xl text-forest mb-3">{copy.heading}</h3>
            <p className="text-sm text-charcoal/75 leading-relaxed mb-6">{copy.intro(firstName)}</p>

            <div className="rounded-xl border border-forest/10 bg-white p-4 mb-4">
              <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Tu reserva</p>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-charcoal/50">Reserva</dt>
                <dd className="text-right font-mono text-charcoal">{reservation.id}</dd>
                <dt className="text-charcoal/50">Cabaña</dt>
                <dd className="text-right text-charcoal">{cabin?.name}</dd>
                <dt className="text-charcoal/50">Check-in</dt>
                <dd className="text-right text-charcoal">{formatDate(reservation.checkIn)}</dd>
                <dt className="text-charcoal/50">Check-out</dt>
                <dd className="text-right text-charcoal">{formatDate(reservation.checkOut)}</dd>
                <dt className="text-charcoal/50">Huéspedes</dt>
                <dd className="text-right text-charcoal">{reservation.guestsCount}</dd>
                <dt className="text-charcoal/50">Noches</dt>
                <dd className="text-right text-charcoal">{reservation.nights}</dd>
              </dl>
            </div>

            <div className="rounded-xl border border-forest/10 bg-white p-4 mb-4">
              <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">
                Información de pago
              </p>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-charcoal/50">Total</dt>
                <dd className="text-right text-charcoal">{formatCurrency(reservation.total)}</dd>
                <dt className="text-charcoal/50">Seña abonada</dt>
                <dd className="text-right text-charcoal">{formatCurrency(reservation.deposit)}</dd>
                <dt className="text-charcoal/50 font-medium">Saldo pendiente</dt>
                <dd className="text-right font-semibold text-forest">{formatCurrency(reservation.balance)}</dd>
              </dl>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border border-forest/10 bg-white p-4">
                <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-1">Check-in</p>
                <p className="text-sm text-charcoal">{settings.complexInfo.checkInWindow} hs</p>
              </div>
              <div className="rounded-xl border border-forest/10 bg-white p-4">
                <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-1">Check-out</p>
                <p className="text-sm text-charcoal">{settings.complexInfo.checkOutWindow} hs</p>
              </div>
            </div>

            <div className="rounded-xl bg-forest/5 p-4 mb-6">
              <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-1.5">
                Política de cancelación
              </p>
              <p className="text-xs text-charcoal/65 leading-relaxed">{settings.cancellationPolicy}</p>
            </div>

            <div className="text-center mb-6">
              <Button size="sm" onClick={() => setView("summary")}>
                Ver mi reserva
              </Button>
            </div>

            <div className="border-t border-forest/10 pt-4 text-xs text-charcoal/50 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin size={12} /> {settings.complexInfo.address}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone size={12} /> {settings.complexInfo.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <MessageCircle size={12} /> WhatsApp: +{settings.complexInfo.whatsapp}
              </p>
              <p className="flex items-center gap-1.5">
                <Mail size={12} /> {settings.complexInfo.email}
              </p>
              <p>{settings.complexInfo.hours}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setView("email")}
            className="flex items-center gap-1.5 text-xs text-forest/70 hover:text-forest mb-4"
          >
            <ArrowLeft size={14} /> Volver al email
          </button>
          <GuestReservationSummary reservation={reservation} />
        </div>
      )}
    </Modal>
  );
}

export function GuestReservationSummary({ reservation }: { reservation: Reservation }) {
  const { getCabin, settings } = useApp();
  const cabin = getCabin(reservation.cabinId);

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-6">
      <div className="text-center mb-6">
        <div className="w-11 h-11 rounded-full border border-gold/50 flex items-center justify-center text-gold mx-auto mb-3">
          <Leaf size={18} />
        </div>
        <p className="font-serif-display text-lg text-forest">Las Acacias Cabañas</p>
        <p className="text-xs text-charcoal/45 mt-1 font-mono">{reservation.id}</p>
      </div>

      <div className="space-y-3 text-sm">
        <Row label="Estado" value={reservation.status} />
        <Row label="Cabaña" value={cabin?.name ?? ""} />
        <Row label="Check-in" value={formatDate(reservation.checkIn)} />
        <Row label="Check-out" value={formatDate(reservation.checkOut)} />
        <Row label="Huéspedes" value={String(reservation.guestsCount)} />
        <Row label="Noches" value={String(reservation.nights)} />
        <div className="h-px bg-forest/10 my-2" />
        <Row label="Total" value={formatCurrency(reservation.total)} />
        <Row label="Seña abonada" value={formatCurrency(reservation.deposit)} />
        <Row label="Saldo a abonar en el check-in" value={formatCurrency(reservation.balance)} strong />
      </div>

      <div className="rounded-xl bg-forest/5 p-4 mt-5">
        <p className="text-xs text-charcoal/65 leading-relaxed">{settings.cancellationPolicy}</p>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-charcoal/50">{label}</span>
      <span className={strong ? "font-semibold text-forest" : "text-charcoal"}>{value}</span>
    </div>
  );
}
