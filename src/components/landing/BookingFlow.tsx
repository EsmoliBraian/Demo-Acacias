"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Copy, Check, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Input } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { TermsModal } from "./TermsModal";
import { GuestReservationSummary } from "@/components/reservas/EmailPreviewModal";
import { assetPath, formatCurrency, formatDate, nightsBetween } from "@/lib/utils";
import type { Reservation } from "@/lib/types";

type Step = "resumen" | "datos" | "pago" | "exito";

const steps: { key: Step; label: string }[] = [
  { key: "resumen", label: "Estadía" },
  { key: "datos", label: "Tus datos" },
  { key: "pago", label: "Seña" },
  { key: "exito", label: "Listo" },
];

export function BookingFlow({
  open,
  onClose,
  cabinId,
  checkIn,
  checkOut,
  guests,
}: {
  open: boolean;
  onClose: () => void;
  cabinId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const { getCabin, getActiveOffersForCabin, computePricing, createReservation, markVoucherSent, settings } = useApp();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("resumen");
  const [guestsCount, setGuestsCount] = useState(guests);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const cabin = getCabin(cabinId);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const offers = getActiveOffersForCabin(cabinId).filter((o) => nights >= o.minNights);
  const offer = offers[0] ?? null;
  const pricing = useMemo(
    () => computePricing(cabinId, checkIn, checkOut, offer?.id ?? null),
    [cabinId, checkIn, checkOut, offer, computePricing]
  );

  if (!open || !cabin) return null;

  const canGoDatos = nights > 0 && guestsCount > 0;
  const canGoPago = firstName && lastName && email.includes("@") && phone;

  const reset = () => {
    setStep("resumen");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAcceptedTerms(false);
    setReservation(null);
    setShowSummary(false);
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    showToast("Copiado correctamente.");
    setTimeout(() => setCopied(null), 1500);
  };

  const handleConfirm = () => {
    const r = createReservation({
      cabinId,
      checkIn,
      checkOut,
      guestsCount,
      firstName,
      lastName,
      email,
      phone,
      offerId: offer?.id ?? null,
      acceptedTerms,
    });
    setReservation(r);
  };

  const whatsappMessage = reservation
    ? `Hola Las Acacias 👋\n\nAcabo de realizar una reserva.\n\nN° de reserva: ${reservation.id}\n\nHuésped: ${reservation.guestFirstName} ${reservation.guestLastName}\n\nCabaña: ${cabin.name}\n\nCheck-in: ${formatDate(reservation.checkIn)}\n\nCheck-out: ${formatDate(reservation.checkOut)}\n\nTotal: ${formatCurrency(reservation.total)}\n\nSeña transferida: ${formatCurrency(reservation.deposit)}\n\nAdjunto el comprobante de transferencia.\n\n¡Gracias!`
    : "";

  const handleSendWhatsapp = () => {
    if (!reservation) return;
    markVoucherSent(reservation.id);
    window.open(`https://wa.me/${settings.complexInfo.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    setStep("exito");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          onClose();
          setTimeout(reset, 300);
        }}
        size="lg"
        title={cabin.name}
        subtitle={`${formatDate(checkIn)} — ${formatDate(checkOut)} · ${nights} noche${nights === 1 ? "" : "s"}`}
      >
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => {
            const currentIdx = steps.findIndex((x) => x.key === step);
            const active = i <= currentIdx;
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 transition-colors ${
                    active ? "bg-forest text-cream" : "bg-charcoal/8 text-charcoal/40"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${active ? "text-charcoal font-medium" : "text-charcoal/40"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className={`h-px flex-1 ${active ? "bg-forest/40" : "bg-charcoal/10"}`} />}
              </div>
            );
          })}
        </div>

        {step === "resumen" && (
          <div>
            <div className="relative h-40 rounded-xl overflow-hidden mb-5">
              <Image src={assetPath(cabin.images[0])} alt={cabin.name} fill unoptimized className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <Label>Huéspedes</Label>
                <Input
                  type="number"
                  min={1}
                  max={cabin.capacity}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Capacidad máxima</Label>
                <p className="text-sm text-charcoal/60 py-2.5">{cabin.capacity} huéspedes</p>
              </div>
            </div>

            {offer && (
              <div className="flex items-center gap-2.5 rounded-xl bg-gold/15 border border-gold/30 px-4 py-3 mb-5">
                <Sparkles size={16} className="text-[#8a7940] shrink-0" />
                <p className="text-sm text-charcoal">
                  Oferta aplicada: <strong>{offer.name}</strong> —{" "}
                  {offer.type === "porcentaje" ? `${offer.discountValue}% OFF` : offer.type === "noche_gratis" ? "1 noche gratis" : `${formatCurrency(offer.discountValue)} OFF`}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-forest/10 p-4 space-y-2 text-sm mb-6">
              <Row label="Precio por noche" value={formatCurrency(pricing.pricePerNight)} />
              <Row label="Subtotal" value={formatCurrency(pricing.subtotal)} />
              {pricing.discountAmount > 0 && <Row label="Descuento" value={`-${formatCurrency(pricing.discountAmount)}`} />}
              <Row label="Total" value={formatCurrency(pricing.total)} strong />
            </div>

            <Button className="w-full" disabled={!canGoDatos} onClick={() => setStep("datos")}>
              Continuar
            </Button>
          </div>
        )}

        {step === "datos" && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label>Nombre</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Pérez" />
              </div>
            </div>
            <div className="mb-3">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@email.com" />
              <p className="text-[11px] text-charcoal/45 mt-1">Lo usaremos para enviarte las notificaciones de tu reserva.</p>
            </div>
            <div className="mb-6">
              <Label>Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 9 11 1234-5678" />
            </div>
            <div className="flex gap-2.5">
              <Button variant="ghost" onClick={() => setStep("resumen")}>
                Volver
              </Button>
              <Button className="flex-1" disabled={!canGoPago} onClick={() => setStep("pago")}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === "pago" && !reservation && (
          <div>
            <div className="rounded-xl border border-forest/10 p-4 space-y-2 text-sm mb-4">
              <Row label="Cabaña" value={cabin.name} />
              <Row label="Check-in" value={formatDate(checkIn)} />
              <Row label="Check-out" value={formatDate(checkOut)} />
              <Row label="Huéspedes" value={String(guestsCount)} />
              <Row label="Noches" value={String(nights)} />
              <div className="h-px bg-forest/10 my-1" />
              <Row label="Subtotal" value={formatCurrency(pricing.subtotal)} />
              {pricing.discountAmount > 0 && <Row label="Descuento" value={`-${formatCurrency(pricing.discountAmount)}`} />}
              <Row label="Total" value={formatCurrency(pricing.total)} strong />
            </div>

            <div className="rounded-2xl bg-forest text-cream p-5 mb-5 text-center">
              <p className="text-xs uppercase tracking-wide text-cream/60 mb-1">Seña a transferir</p>
              <p className="font-serif-display text-3xl">{formatCurrency(pricing.deposit)}</p>
              <p className="text-xs text-cream/50 mt-1">30% del total · Saldo restante: {formatCurrency(pricing.balance)}</p>
            </div>

            <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-forest w-4 h-4 shrink-0"
              />
              <span className="text-xs text-charcoal/65 leading-relaxed">
                Acepto los{" "}
                <button type="button" onClick={() => setTermsOpen(true)} className="text-forest underline underline-offset-2">
                  términos y la política de cancelación
                </button>
                .
              </span>
            </label>

            <div className="flex gap-2.5">
              <Button variant="ghost" onClick={() => setStep("datos")}>
                Volver
              </Button>
              <Button className="flex-1" disabled={!acceptedTerms} onClick={handleConfirm}>
                Confirmar y generar seña
              </Button>
            </div>
          </div>
        )}

        {step === "pago" && reservation && (
          <div>
            <div className="rounded-xl bg-forest/8 text-center py-4 mb-5">
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Reserva generada</p>
              <p className="font-serif-display text-2xl text-forest mt-1">{reservation.id}</p>
            </div>

            <div className="rounded-2xl border border-forest/10 p-5 mb-5">
              <p className="text-sm font-medium text-charcoal mb-3">Transferencia bancaria</p>
              <dl className="space-y-2 text-sm mb-4">
                <Row label="Banco" value={settings.bankData.bank} />
                <Row label="Titular" value={settings.bankData.holder} />
                <Row label="CUIT" value={settings.bankData.cuit} />
              </dl>
              <CopyRow label="CBU" value={settings.bankData.cbu} copied={copied === "CBU"} onCopy={() => copy("CBU", settings.bankData.cbu)} />
              <CopyRow
                label="Alias"
                value={settings.bankData.alias}
                copied={copied === "Alias"}
                onCopy={() => copy("Alias", settings.bankData.alias)}
              />
              <CopyRow label="Concepto" value={reservation.id} copied={copied === "Concepto"} onCopy={() => copy("Concepto", reservation.id)} />
            </div>

            <Button className="w-full" size="lg" icon={<MessageCircle size={18} />} onClick={handleSendWhatsapp}>
              Enviar comprobante por WhatsApp
            </Button>
          </div>
        )}

        {step === "exito" && reservation && !showSummary && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-serif-display text-xl text-forest mb-2">¡Ya casi está todo listo!</h3>
            <p className="text-sm text-charcoal/60 max-w-sm mx-auto mb-6">
              Recibimos tu comprobante y lo estamos verificando. Te vamos a confirmar la reserva por email en breve.
            </p>
            <div className="rounded-xl bg-beige/60 p-4 max-w-xs mx-auto mb-6 text-sm space-y-1.5">
              <p className="text-charcoal/50 text-xs uppercase tracking-wide">Reserva</p>
              <p className="font-mono text-charcoal font-medium">{reservation.id}</p>
              <p className="text-charcoal/50 text-xs mt-2">Estado</p>
              <p className="text-forest font-medium">{reservation.status}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button variant="outline" onClick={() => setShowSummary(true)}>
                Ver mi reserva
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  setTimeout(reset, 300);
                }}
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        )}

        {step === "exito" && reservation && showSummary && <GuestReservationSummary reservation={reservation} />}
      </Modal>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
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

function CopyRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <p className="text-[11px] text-charcoal/45">{label}</p>
        <p className="text-sm text-charcoal font-mono truncate">{value}</p>
      </div>
      <button
        onClick={onCopy}
        className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-forest border border-forest/20 rounded-full px-3 py-1.5 hover:bg-forest/5 transition-colors"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
