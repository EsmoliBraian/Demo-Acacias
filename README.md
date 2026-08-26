# Las Acacias Cabañas — Demo interactiva

Propuesta comercial interactiva para Las Acacias Cabañas: web pública premium + sistema de reservas y gestión.

**Esto es una demo de presentación**, no un producto en producción. No hay backend, base de datos ni integraciones reales (WhatsApp, email, Mercado Pago, banco). Todo el estado se maneja en el cliente con React Context + `localStorage`, sobre datos simulados en `src/data/mockData.ts`.

## Stack

Next.js (App Router, export estático) · React · TypeScript · Tailwind CSS v4 · Recharts · Lucide React

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

- `/` — landing pública con motor de reservas, ofertas y flujo de seña por transferencia + WhatsApp.
- `/demo/dashboard` — panel administrativo (reservas, calendario, cabañas, huéspedes, pagos, ofertas, reportes, mensajes, automatizaciones, historial, configuración).

Usá **Reiniciar demo** en el panel administrativo para volver todos los datos a su estado inicial entre presentaciones.

## Build y deploy

`npm run build` genera un export estático en `./out` (configurado vía `output: "export"` en `next.config.ts`). El workflow en `.github/workflows/deploy.yml` publica automáticamente ese export a GitHub Pages en cada push a `main`.
