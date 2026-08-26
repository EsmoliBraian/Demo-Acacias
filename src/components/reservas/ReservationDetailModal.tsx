"use client";

import { useState } from "react";
import { ArrowLeftRight, Ban, Mail, Receipt, ShieldCheck, BadgeCheck, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ReservationStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { useApp } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { useToast } from "@/components/ui/Toast";
import { VoucherModal } from "./VoucherModal";
import { ChangeCabinModal } from "./ChangeCabinModal";
import { EmailPreviewModal } from "./EmailPreviewModal";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { EmailLogEntry } from "@/lib/types";

export function ReservationDetailModal() {
  const { openReservationId, closeReservation } = useUI();
  const { getReservation, getCabin, confirmReservation } = useApp();
  const { showToast } = useToast();

  const [voucherOpen, setVoucherOpen] = useState(false);
  const [changeCabinOpen, setChangeCabinOpen] = useState(false);
  const [emailType, setEmailType] = useState<EmailLogEntry["type"] | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { cancelReservation } = useApp();

  const reservation = openReservationId ? getReservation(openReservationId) : undefined;
  if (!openReservationId || !reservation) return null;

  const cabin = getCabin(reservation.cabinId);
  const canCancel = !["Cancelada", "Finalizada"].includes(reservation.status);

  return (
    <>
      <Modal
        open={!!openReservationId}
        onClose={() => {
          setConfirmCancel(false);
          closeReservation();
        }}
        size="lg"
        title={`Reserva ${reservation.id}`}
        subtitle={`Creada el ${formatDateTime(reservation.createdAt)} · ${reservation.source}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <ReservationStatusBadge status={reservation.status} />
          <PaymentStatusBadge status={reservation.paymentStatus} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <section className="rounded-xl border border-forest/10 p-4">
            <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Huésped</p>
            <dl className="space-y-2 text-sm">
              <Row label="Nombre" value={`${reservation.guestFirstName} ${reservation.guestLastName}`} />
              <Row label="Email" value={reservation.guestEmail} />
              <Row label="Teléfono" value={reservation.guestPhone} />
            </dl>
          </section>

          <section className="rounded-xl border border-forest/10 p-4">
            <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Estadía</p>
            <dl className="space-y-2 text-sm">
              <Row label="Cabaña" value={cabin?.name ?? "—"} />
              <Row label="Check-in" value={formatDate(reservation.checkIn)} />
              <Row label="Check-out" value={formatDate(reservation.checkOut)} />
              <Row label="Huéspedes" value={`${reservation.guestsCount}`} />
              <Row label="Noches" value={`${reservation.nights}`} />
            </dl>
          </section>
        </div>

        <section className="rounded-xl border border-forest/10 p-4 mb-4">
          <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Pago</p>
          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(reservation.subtotal)} />
            {reservation.discountAmount > 0 && (
              <Row label="Descuento" value={`-${formatCurrency(reservation.discountAmount)}`} tone="gold" />
            )}
            <Row label="Total" value={formatCurrency(reservation.total)} strong />
            <Row label="Seña (30%)" value={formatCurrency(reservation.deposit)} />
            <Row label="Saldo" value={formatCurrency(reservation.balance)} />
          </dl>
        </section>

        {reservation.cabinChanges.length > 0 && (
          <section className="rounded-xl border border-forest/10 p-4 mb-4">
            <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">
              Historial de cambios de cabaña
            </p>
            <div className="space-y-3">
              {reservation.cabinChanges.map((c) => (
                <div key={c.id} className="text-sm">
                  <p className="text-charcoal">
                    {getCabin(c.fromCabinId)?.name} → {getCabin(c.toCabinId)?.name}
                  </p>
                  <p className="text-xs text-charcoal/45">
                    {formatDateTime(c.date)} · {c.user} · {c.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-forest/10 p-4 mb-6">
          <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-3">Comunicaciones</p>
          {reservation.emailLog.length === 0 ? (
            <p className="text-sm text-charcoal/45">Todavía no se enviaron emails para esta reserva.</p>
          ) : (
            <div className="space-y-3">
              {reservation.emailLog.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-forest/8 text-forest flex items-center justify-center shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-charcoal truncate">✓ {e.subject}</p>
                    <p className="text-xs text-charcoal/45">
                      {formatDateTime(e.sentAt)} · Para: {e.recipient}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setEmailType(e.type)}>
                    Ver email
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-2.5">
          {reservation.status === "Comprobante pendiente" && (
            <Button icon={<Receipt size={15} />} onClick={() => setVoucherOpen(true)}>
              Ver comprobante
            </Button>
          )}
          {reservation.status === "Seña verificada" && (
            <Button
              icon={<BadgeCheck size={15} />}
              onClick={() => {
                confirmReservation(reservation.id);
                showToast("✓ Reserva confirmada", {
                  description: `✓ Email enviado a ${reservation.guestEmail}`,
                });
              }}
            >
              Confirmar reserva
            </Button>
          )}
          {reservation.status === "Confirmada" && (
            <Button icon={<Sparkles size={15} />} variant="outline" onClick={() => setEmailType("reserva_confirmada")}>
              Ver email de confirmación
            </Button>
          )}
          {["Seña pendiente", "Comprobante pendiente", "Seña verificada"].includes(reservation.status) && (
            <span className="inline-flex items-center gap-1.5 text-xs text-charcoal/40 px-1">
              <ShieldCheck size={13} /> Editar reserva
            </span>
          )}
          <Button variant="outline" icon={<ArrowLeftRight size={15} />} onClick={() => setChangeCabinOpen(true)}>
            Cambiar cabaña
          </Button>
          {canCancel && (
            <Button
              variant="danger"
              icon={<Ban size={15} />}
              onClick={() => {
                if (confirmCancel) {
                  cancelReservation(reservation.id, "Cancelada por el administrador");
                  showToast("Reserva cancelada", { variant: "info" });
                  setConfirmCancel(false);
                } else {
                  setConfirmCancel(true);
                  setTimeout(() => setConfirmCancel(false), 3000);
                }
              }}
            >
              {confirmCancel ? "¿Confirmar cancelación?" : "Cancelar reserva"}
            </Button>
          )}
        </div>
      </Modal>

      <VoucherModal reservation={reservation} open={voucherOpen} onClose={() => setVoucherOpen(false)} />
      <ChangeCabinModal reservation={reservation} open={changeCabinOpen} onClose={() => setChangeCabinOpen(false)} />
      <EmailPreviewModal reservation={reservation} type={emailType} open={!!emailType} onClose={() => setEmailType(null)} />
    </>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "gold";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-charcoal/50">{label}</span>
      <span
        className={
          strong
            ? "font-semibold text-forest"
            : tone === "gold"
            ? "text-[#8a7940] font-medium"
            : "text-charcoal text-right"
        }
      >
        {value}
      </span>
    </div>
  );
}
