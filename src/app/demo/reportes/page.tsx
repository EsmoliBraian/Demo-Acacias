"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Percent, Wallet, ClipboardList, Ticket, Clock3, Ban, Tag } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import {
  occupancyByCabin,
  revenueByMonth,
  reservationsByMonth,
  originData,
  cancellationsByMonth,
  offerUsage,
  CHART_COLORS,
  kpis,
} from "@/data/analytics";
import { formatCurrency } from "@/lib/utils";

const ranges = ["7 días", "30 días", "90 días", "Este año"];

export default function ReportesPage() {
  const [range, setRange] = useState("30 días");

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Métricas de desempeño del complejo"
        actions={
          <div className="flex rounded-xl border border-forest/15 p-1 bg-white">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  range === r ? "bg-forest text-cream" : "text-charcoal/60 hover:bg-forest/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ocupación" numeric={kpis.occupancy.value} suffix="%" delta={kpis.occupancy.delta} icon={Percent} />
        <StatCard label="Ingresos" numeric={kpis.revenue.value} prefix="$" delta={kpis.revenue.delta} icon={Wallet} />
        <StatCard label="Reservas" numeric={kpis.reservations.value} delta={kpis.reservations.delta} icon={ClipboardList} />
        <StatCard label="Ticket promedio" value={formatCurrency(kpis.avgTicket.value)} delta={kpis.avgTicket.delta} icon={Ticket} />
        <StatCard label="Estadía promedio" value={`${kpis.avgStay.value} noches`} delta={kpis.avgStay.delta} icon={Clock3} />
        <StatCard label="Cancelaciones" numeric={kpis.cancellations.value} delta={kpis.cancellations.delta} icon={Ban} />
        <StatCard label="Ofertas utilizadas" numeric={45} delta={22} icon={Tag} />
        <StatCard label="Saldo pendiente" value={formatCurrency(3250000)} icon={Wallet} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por cabaña</CardTitle>
          </CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByCabin} barSize={32}>
                <CartesianGrid vertical={false} stroke="#26382519" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis unit="%" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} formatter={(v) => [`${Number(v)}%`, "Ocupación"]} />
                <Bar dataKey="ocupacion" fill="#263B25" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas por mes</CardTitle>
          </CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reservationsByMonth}>
                <CartesianGrid vertical={false} stroke="#26382519" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="reservas" stroke="#B5A56A" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ingresos mensuales</CardTitle>
          </CardHeader>
          <CardBody className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth} barSize={30}>
                <CartesianGrid vertical={false} stroke="#26382519" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#11150f99" }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} formatter={(v) => [formatCurrency(Number(v)), "Ingresos"]} />
                <Bar dataKey="ingresos" fill="#596747" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origen de reservas</CardTitle>
          </CardHeader>
          <CardBody className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={originData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={68} paddingAngle={2}>
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

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cancelaciones por mes</CardTitle>
          </CardHeader>
          <CardBody className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cancellationsByMonth}>
                <CartesianGrid vertical={false} stroke="#26382519" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="cancelaciones" stroke="#b45309" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de ofertas</CardTitle>
          </CardHeader>
          <CardBody className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offerUsage} layout="vertical" barSize={22}>
                <CartesianGrid horizontal={false} stroke="#26382519" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#11150f99" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="usos" fill="#B5A56A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
