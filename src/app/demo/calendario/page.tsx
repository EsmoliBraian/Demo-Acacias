"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AdminNewReservationModal } from "@/components/calendario/AdminNewReservationModal";
import { useApp } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@/lib/types";

const DAY_W = 40;
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const weekdays = ["D", "L", "M", "M", "J", "V", "S"];

const statusColor: Record<ReservationStatus, string> = {
  "Reserva creada": "bg-charcoal/25",
  "Seña pendiente": "bg-gold",
  "Comprobante pendiente": "bg-sky-500",
  "Seña verificada": "bg-olive",
  Confirmada: "bg-forest",
  "Check-in": "bg-forest",
  Finalizada: "bg-charcoal/20",
  Cancelada: "bg-red-300 line-through",
};

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarioPage() {
  const { cabins, reservations } = useApp();
  const { openReservation } = useUI();
  const [anchor, setAnchor] = useState(() => new Date(2026, 8, 1));
  const [view, setView] = useState<"mes" | "semana">("mes");
  const [newOpen, setNewOpen] = useState(false);

  const days = useMemo(() => {
    if (view === "mes") {
      const year = anchor.getFullYear();
      const month = anchor.getMonth();
      const count = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: count }, (_, i) => new Date(year, month, i + 1));
    }
    const start = new Date(anchor);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [anchor, view]);

  const rangeStart = toISO(days[0]);
  const rangeEnd = toISO(days[days.length - 1]);

  const shiftAnchor = (dir: 1 | -1) => {
    const d = new Date(anchor);
    if (view === "mes") d.setMonth(d.getMonth() + dir);
    else d.setDate(d.getDate() + dir * 7);
    setAnchor(d);
  };

  return (
    <div>
      <PageHeader
        title="Calendario"
        subtitle="Ocupación de cabañas por fecha"
        actions={
          <>
            <div className="flex rounded-xl border border-forest/15 p-1 bg-white">
              {(["mes", "semana"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors capitalize",
                    view === v ? "bg-forest text-cream" : "text-charcoal/60 hover:bg-forest/5"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button icon={<Plus size={16} />} onClick={() => setNewOpen(true)}>
              Nueva reserva
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => shiftAnchor(-1)} className="p-1.5 rounded-lg hover:bg-forest/8 text-forest">
          <ChevronLeft size={18} />
        </button>
        <p className="font-serif-display text-lg text-forest min-w-[180px]">
          {view === "mes"
            ? `${monthNames[anchor.getMonth()]} ${anchor.getFullYear()}`
            : `${days[0].getDate()} ${monthNames[days[0].getMonth()]} — ${days[6].getDate()} ${monthNames[days[6].getMonth()]}`}
        </p>
        <button onClick={() => shiftAnchor(1)} className="p-1.5 rounded-lg hover:bg-forest/8 text-forest">
          <ChevronRight size={18} />
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <div style={{ minWidth: 180 + days.length * DAY_W }}>
            <div className="flex border-b border-forest/10 sticky top-0 bg-white z-10">
              <div className="w-[180px] shrink-0 px-4 py-2.5 text-xs font-semibold text-charcoal/50 uppercase tracking-wide">
                Cabaña
              </div>
              {days.map((d) => {
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <div
                    key={d.toISOString()}
                    style={{ width: DAY_W }}
                    className={cn(
                      "shrink-0 text-center py-2.5 text-[11px] border-l border-forest/6",
                      isWeekend ? "bg-forest/[0.03] text-forest/70 font-medium" : "text-charcoal/50"
                    )}
                  >
                    <div>{weekdays[d.getDay()]}</div>
                    <div className="font-semibold text-charcoal/70">{d.getDate()}</div>
                  </div>
                );
              })}
            </div>

            {cabins.map((cabin) => {
              const cabinReservations = reservations.filter(
                (r) => r.cabinId === cabin.id && r.status !== "Cancelada" && r.checkIn <= rangeEnd && r.checkOut >= rangeStart
              );
              return (
                <div key={cabin.id} className="flex border-b border-forest/6 relative" style={{ height: 52 }}>
                  <div className="w-[180px] shrink-0 px-4 flex items-center text-sm font-medium text-charcoal">
                    {cabin.name}
                  </div>
                  <div className="relative flex-1" style={{ width: days.length * DAY_W }}>
                    {days.map((d, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-forest/6"
                        style={{ left: i * DAY_W, width: DAY_W }}
                      />
                    ))}
                    {cabinReservations.map((r) => {
                      const startIdx = Math.max(0, days.findIndex((d) => toISO(d) === r.checkIn.slice(0, 10)));
                      const clippedStart = r.checkIn < rangeStart ? 0 : startIdx;
                      let endIdx = days.findIndex((d) => toISO(d) === r.checkOut.slice(0, 10));
                      if (endIdx === -1) endIdx = r.checkOut > rangeEnd ? days.length : 0;
                      const left = clippedStart * DAY_W + 3;
                      const width = Math.max(DAY_W - 6, (endIdx - clippedStart) * DAY_W - 6);
                      return (
                        <button
                          key={r.id}
                          onClick={() => openReservation(r.id)}
                          style={{ left, width, top: 8 }}
                          className={cn(
                            "absolute h-9 rounded-lg text-[11px] text-white px-2 flex items-center truncate shadow-sm hover:brightness-110 transition-all",
                            statusColor[r.status]
                          )}
                          title={`${r.guestFirstName} ${r.guestLastName} — ${r.status}`}
                        >
                          {r.guestFirstName} {r.guestLastName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-4 mt-4">
        {Object.entries(statusColor).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-charcoal/55">
            <span className={cn("w-2.5 h-2.5 rounded-full", color.split(" ")[0])} />
            {status}
          </div>
        ))}
      </div>

      <AdminNewReservationModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}
