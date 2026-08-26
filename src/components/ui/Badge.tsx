import React from "react";
import { cn } from "@/lib/utils";
import type {
  ReservationStatus,
  PaymentStatus,
  CabinStatus,
  OfferStatus,
} from "@/lib/types";

type Tone = "forest" | "gold" | "olive" | "red" | "neutral" | "blue";

const toneClasses: Record<Tone, string> = {
  forest: "bg-forest/10 text-forest",
  gold: "bg-gold/20 text-[#8a7940]",
  olive: "bg-olive/15 text-olive",
  red: "bg-red-50 text-red-700",
  neutral: "bg-charcoal/6 text-charcoal/60",
  blue: "bg-sky-50 text-sky-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const reservationTone: Record<ReservationStatus, Tone> = {
  "Reserva creada": "neutral",
  "Seña pendiente": "gold",
  "Comprobante pendiente": "blue",
  "Seña verificada": "olive",
  Confirmada: "forest",
  "Check-in": "forest",
  Finalizada: "neutral",
  Cancelada: "red",
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return <Badge tone={reservationTone[status]}>{status}</Badge>;
}

const paymentTone: Record<PaymentStatus, Tone> = {
  Pendiente: "gold",
  "Comprobante pendiente": "blue",
  "Seña verificada": "olive",
  Pagado: "forest",
  Reembolsado: "red",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={paymentTone[status]}>{status}</Badge>;
}

const cabinTone: Record<CabinStatus, Tone> = {
  Disponible: "forest",
  Ocupada: "gold",
  Mantenimiento: "blue",
  Inactiva: "red",
};

export function CabinStatusBadge({ status }: { status: CabinStatus }) {
  return <Badge tone={cabinTone[status]}>{status}</Badge>;
}

const offerTone: Record<OfferStatus, Tone> = {
  Activa: "forest",
  Pausada: "neutral",
  Programada: "blue",
};

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return <Badge tone={offerTone[status]}>{status}</Badge>;
}
