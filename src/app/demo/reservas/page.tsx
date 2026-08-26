"use client";

import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Field";
import { ReservationStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { useApp } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { ReservationStatus } from "@/lib/types";

const ALL = "Todos";

export default function ReservasPage() {
  const { reservations, getCabin } = useApp();
  const { openReservation } = useUI();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReservationStatus | typeof ALL>(ALL);

  const filtered = useMemo(() => {
    return reservations
      .filter((r) => status === ALL || r.status === status)
      .filter((r) => {
        const q = query.toLowerCase();
        if (!q) return true;
        return (
          r.id.toLowerCase().includes(q) ||
          `${r.guestFirstName} ${r.guestLastName}`.toLowerCase().includes(q) ||
          (getCabin(r.cabinId)?.name.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reservations, status, query, getCabin]);

  const statuses: (ReservationStatus | typeof ALL)[] = [
    ALL,
    "Reserva creada",
    "Seña pendiente",
    "Comprobante pendiente",
    "Seña verificada",
    "Confirmada",
    "Check-in",
    "Finalizada",
    "Cancelada",
  ];

  return (
    <div>
      <PageHeader title="Reservas" subtitle={`${filtered.length} de ${reservations.length} reservas`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35" />
          <Input
            placeholder="Buscar por N°, huésped o cabaña…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as ReservationStatus | typeof ALL)} className="sm:w-64">
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === ALL ? "Todos los estados" : s}
            </option>
          ))}
        </Select>
      </div>

      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-xs text-charcoal/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Huésped</th>
                <th className="px-4 py-3 font-medium">Cabaña</th>
                <th className="px-4 py-3 font-medium">Check-in</th>
                <th className="px-4 py-3 font-medium">Check-out</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Seña</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Pago</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => openReservation(r.id)}
                  className="border-b border-forest/6 hover:bg-forest/[0.025] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 font-mono text-xs text-charcoal/70">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {r.guestFirstName} {r.guestLastName}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{getCabin(r.cabinId)?.name}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatDateShort(r.checkIn)}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatDateShort(r.checkOut)}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatCurrency(r.total)}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatCurrency(r.deposit)}</td>
                  <td className="px-4 py-3">
                    <ReservationStatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={r.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight size={17} className="text-forest/50" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="md:hidden space-y-3">
        {filtered.map((r) => (
          <button key={r.id} onClick={() => openReservation(r.id)} className="w-full text-left block">
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-charcoal text-sm">
                    {r.guestFirstName} {r.guestLastName}
                  </p>
                  <p className="text-xs font-mono text-charcoal/45">{r.id}</p>
                </div>
                <ReservationStatusBadge status={r.status} />
              </div>
              <p className="text-xs text-charcoal/60 mb-2">
                {getCabin(r.cabinId)?.name} · {formatDateShort(r.checkIn)} – {formatDateShort(r.checkOut)}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal/50">
                  Total <strong className="text-charcoal">{formatCurrency(r.total)}</strong>
                </span>
                <PaymentStatusBadge status={r.paymentStatus} />
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
