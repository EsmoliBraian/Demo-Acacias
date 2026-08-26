"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { useApp } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Clock3, CheckCircle2 } from "lucide-react";

export default function PagosPage() {
  const { reservations, getCabin } = useApp();
  const { openReservation } = useUI();

  const totalDeposits = reservations.reduce((s, r) => s + (r.status !== "Cancelada" ? r.deposit : 0), 0);
  const totalBalance = reservations.reduce(
    (s, r) => s + (["Confirmada", "Check-in"].includes(r.status) ? r.balance : 0),
    0
  );
  const paid = reservations.filter((r) => r.paymentStatus === "Pagado").length;

  return (
    <div>
      <PageHeader title="Pagos" subtitle="Estado de señas y saldos de todas las reservas" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Señas cobradas" value={formatCurrency(totalDeposits)} icon={Wallet} />
        <StatCard label="Saldo pendiente" value={formatCurrency(totalBalance)} icon={Clock3} />
        <StatCard label="Reservas pagadas" numeric={paid} icon={CheckCircle2} />
      </div>

      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-xs text-charcoal/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Reserva</th>
                <th className="px-4 py-3 font-medium">Huésped</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Seña</th>
                <th className="px-4 py-3 font-medium">Saldo</th>
                <th className="px-4 py-3 font-medium">Método</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => openReservation(r.id)}
                  className="border-b border-forest/6 hover:bg-forest/[0.025] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 font-mono text-xs text-charcoal/70">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {r.guestFirstName} {r.guestLastName}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{formatCurrency(r.total)}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatCurrency(r.deposit)}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatCurrency(r.balance)}</td>
                  <td className="px-4 py-3 text-charcoal/60 text-xs">Transferencia bancaria</td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={r.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="md:hidden space-y-3">
        {reservations.map((r) => (
          <button key={r.id} onClick={() => openReservation(r.id)} className="w-full text-left block">
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-medium text-charcoal text-sm">
                  {r.guestFirstName} {r.guestLastName}
                </p>
                <PaymentStatusBadge status={r.paymentStatus} />
              </div>
              <p className="text-xs text-charcoal/45 font-mono mb-2">{r.id}</p>
              <div className="flex justify-between text-xs text-charcoal/60">
                <span>Total {formatCurrency(r.total)}</span>
                <span>Saldo {formatCurrency(r.balance)}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
