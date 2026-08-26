"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Percent, ClipboardList, Wallet, Users, Clock3, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReservationStatusBadge } from "@/components/ui/Badge";
import { activityIconMap } from "@/components/dashboard/ActivityIcon";
import { useApp } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { occupancyByCabin, revenueByMonth, originData, CHART_COLORS, kpis } from "@/data/analytics";
import { formatCurrency, formatDateShort, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const { reservations, activity, getCabin } = useApp();
  const { openReservation } = useUI();

  const pendingVoucher = reservations.filter((r) => r.status === "Comprobante pendiente");
  const pendingDeposit = reservations.filter(
    (r) => r.status === "Seña pendiente" || r.status === "Comprobante pendiente"
  );
  const pendingDepositTotal = pendingDeposit.reduce((sum, r) => sum + r.deposit, 0);
  const pendingBalanceTotal = reservations
    .filter((r) => r.status === "Confirmada" || r.status === "Check-in")
    .reduce((sum, r) => sum + r.balance, 0);

  const upcoming = [...reservations]
    .filter((r) => r.status !== "Cancelada")
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general del complejo — últimos 30 días"
        actions={
          <Link href="/demo/reservas">
            <Button variant="outline" size="sm" iconRight={<ArrowRight size={14} />}>
              Ver reservas
            </Button>
          </Link>
        }
      />

      {pendingVoucher.length > 0 && (
        <button
          onClick={() => openReservation(pendingVoucher[0].id)}
          className="w-full mb-6 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3.5 text-sm text-charcoal hover:bg-gold/15 transition-colors animate-slide-up text-left"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
          <span>
            <strong className="font-semibold">{pendingVoucher.length} comprobante(s) pendiente(s)</strong> de
            verificación — la reserva <strong>{pendingVoucher[0].id}</strong> está esperando confirmación.
          </span>
          <ArrowRight size={15} className="ml-auto shrink-0" />
        </button>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ocupación" numeric={kpis.occupancy.value} suffix="%" delta={kpis.occupancy.delta} icon={Percent} />
        <StatCard label="Reservas" numeric={kpis.reservations.value} delta={kpis.reservations.delta} icon={ClipboardList} />
        <StatCard label="Ingresos" numeric={kpis.revenue.value} prefix="$" delta={kpis.revenue.delta} icon={Wallet} />
        <StatCard label="Huéspedes" numeric={kpis.guests.value} delta={kpis.guests.delta} icon={Users} />
        <StatCard
          label="Señas pendientes"
          value={formatCurrency(pendingDepositTotal)}
          hint={`${pendingDeposit.length} reserva${pendingDeposit.length === 1 ? "" : "s"}`}
          icon={Clock3}
        />
        <StatCard label="Saldo pendiente" value={formatCurrency(pendingBalanceTotal)} icon={Wallet} />
        <StatCard label="Ticket promedio" value={formatCurrency(kpis.avgTicket.value)} delta={kpis.avgTicket.delta} />
        <StatCard label="Estadía promedio" value={`${kpis.avgStay.value} noches`} delta={kpis.avgStay.delta} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ocupación por cabaña</CardTitle>
          </CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByCabin} barSize={34}>
                <CartesianGrid vertical={false} stroke="#26382519" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} unit="%" width={40} />
                <Tooltip
                  cursor={{ fill: "#26382508" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #26382520", fontSize: 13 }}
                  formatter={(v) => [`${Number(v)}%`, "Ocupación"]}
                />
                <Bar dataKey="ocupacion" fill="#263B25" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas próximas</CardTitle>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-forest/8">
            {upcoming.map((r) => (
              <button
                key={r.id}
                onClick={() => openReservation(r.id)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 hover:bg-forest/[0.03] transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {r.guestFirstName} {r.guestLastName}
                  </p>
                  <p className="text-xs text-charcoal/50">
                    {getCabin(r.cabinId)?.name} · {formatDateShort(r.checkIn)} – {formatDateShort(r.checkOut)}
                  </p>
                </div>
                <ReservationStatusBadge status={r.status} />
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ingresos</CardTitle>
          </CardHeader>
          <CardBody className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#263B25" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#263B25" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#26382519" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#11150f99" }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #26382520", fontSize: 13 }}
                  formatter={(v) => [formatCurrency(Number(v)), "Ingresos"]}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#263B25" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origen de reservas</CardTitle>
          </CardHeader>
          <CardBody className="h-60 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={originData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {originData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
          <div className="px-5 pb-5 flex flex-col gap-1.5">
            {originData.map((o, i) => (
              <div key={o.name} className="flex items-center gap-2 text-xs text-charcoal/70">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {o.name}
                <span className="ml-auto font-medium text-charcoal">{o.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
          <Link href="/demo/historial">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />}>
              Ver historial completo
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-forest/8">
          {activity.slice(0, 6).map((a) => {
            const { icon: Icon, tone } = activityIconMap[a.type];
            return (
              <div key={a.id} className="flex items-center gap-3.5 px-5 py-3.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-charcoal">{a.title}</p>
                  <p className="text-xs text-charcoal/45">
                    {a.user} · {formatDateTime(a.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}
