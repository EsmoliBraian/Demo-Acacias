"use client";

import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { GuestProfileModal } from "@/components/huespedes/GuestProfileModal";
import { useApp } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function HuespedesPage() {
  const { guests, reservations } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(() => {
    return guests
      .map((g) => {
        const rs = reservations.filter((r) => r.guestId === g.id);
        const totalSpent = rs.filter((r) => r.status !== "Cancelada").reduce((s, r) => s + r.total, 0);
        const lastStay = rs.sort((a, b) => b.checkIn.localeCompare(a.checkIn))[0];
        return { guest: g, count: rs.length, totalSpent, lastStay };
      })
      .filter((row) =>
        `${row.guest.firstName} ${row.guest.lastName} ${row.guest.email}`.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [guests, reservations, query]);

  const selectedGuest = guests.find((g) => g.id === selected);

  return (
    <div>
      <PageHeader title="Huéspedes" subtitle={`${guests.length} huéspedes registrados`} />

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35" />
        <Input placeholder="Buscar huésped…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
      </div>

      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-xs text-charcoal/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Reservas</th>
                <th className="px-4 py-3 font-medium">Última estadía</th>
                <th className="px-4 py-3 font-medium">Total gastado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ guest, count, totalSpent, lastStay }) => (
                <tr
                  key={guest.id}
                  onClick={() => setSelected(guest.id)}
                  className="border-b border-forest/6 hover:bg-forest/[0.025] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {guest.firstName} {guest.lastName}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{guest.email}</td>
                  <td className="px-4 py-3 text-charcoal/70">{guest.phone}</td>
                  <td className="px-4 py-3 text-charcoal/70">{count}</td>
                  <td className="px-4 py-3 text-charcoal/70">{lastStay ? formatDate(lastStay.checkIn) : "—"}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatCurrency(totalSpent)}</td>
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
        {rows.map(({ guest, count, totalSpent }) => (
          <button key={guest.id} onClick={() => setSelected(guest.id)} className="w-full text-left block">
            <Card className="p-4">
              <p className="font-medium text-charcoal text-sm">
                {guest.firstName} {guest.lastName}
              </p>
              <p className="text-xs text-charcoal/50 mb-2">{guest.email}</p>
              <div className="flex justify-between text-xs text-charcoal/60">
                <span>{count} reservas</span>
                <span className="font-medium text-charcoal">{formatCurrency(totalSpent)}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <GuestProfileModal guest={selectedGuest} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
