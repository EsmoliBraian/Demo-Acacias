export const occupancyByCabin = [
  { name: "Cabaña 1", ocupacion: 74 },
  { name: "Cabaña 2", ocupacion: 88 },
  { name: "Cabaña 3", ocupacion: 95 },
  { name: "Cabaña 4", ocupacion: 61 },
  { name: "Cabaña 5", ocupacion: 82 },
];

export const revenueByMonth = [
  { name: "Mar", ingresos: 2180000 },
  { name: "Abr", ingresos: 2540000 },
  { name: "May", ingresos: 2910000 },
  { name: "Jun", ingresos: 3120000 },
  { name: "Jul", ingresos: 3680000 },
  { name: "Ago", ingresos: 4250000 },
];

export const reservationsByMonth = [
  { name: "Mar", reservas: 68 },
  { name: "Abr", reservas: 79 },
  { name: "May", reservas: 91 },
  { name: "Jun", reservas: 97 },
  { name: "Jul", reservas: 112 },
  { name: "Ago", reservas: 128 },
];

export const originData = [
  { name: "Web", value: 45 },
  { name: "Directas", value: 30 },
  { name: "OTA's", value: 20 },
  { name: "Otros", value: 5 },
];

export const cancellationsByMonth = [
  { name: "Mar", cancelaciones: 3 },
  { name: "Abr", cancelaciones: 2 },
  { name: "May", cancelaciones: 4 },
  { name: "Jun", cancelaciones: 2 },
  { name: "Jul", cancelaciones: 3 },
  { name: "Ago", cancelaciones: 1 },
];

export const offerUsage = [
  { name: "Escapada de fin de semana", usos: 34 },
  { name: "3 noches + 1 gratis", usos: 11 },
  { name: "Última hora", usos: 0 },
];

export const CHART_COLORS = ["#263B25", "#B5A56A", "#596747", "#8C9A82"];

export const kpis = {
  occupancy: { value: 82, delta: 12 },
  reservations: { value: 128, delta: 18 },
  revenue: { value: 4250000, delta: 25 },
  guests: { value: 256, delta: 14 },
  avgTicket: { value: 33203, delta: 6 },
  avgStay: { value: 2.6, delta: 3 },
  cancellations: { value: 15, delta: -8 },
};
