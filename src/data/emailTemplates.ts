import type { EmailLogEntry } from "@/lib/types";

export const emailTemplateCopy: Record<
  EmailLogEntry["type"],
  { subjectPrefix: string; heading: string; intro: (firstName: string) => string }
> = {
  reserva_recibida: {
    subjectPrefix: "Recibimos tu reserva",
    heading: "¡Recibimos tu solicitud de reserva!",
    intro: (n) =>
      `Hola ${n}, recibimos tu solicitud de reserva en Las Acacias. En cuanto verifiquemos tu comprobante te enviaremos la confirmación.`,
  },
  comprobante_pendiente: {
    subjectPrefix: "Recibimos tu comprobante",
    heading: "Estamos verificando tu comprobante",
    intro: (n) =>
      `Hola ${n}, recibimos tu comprobante de transferencia y lo estamos verificando. Te avisaremos apenas quede confirmado.`,
  },
  reserva_confirmada: {
    subjectPrefix: "Reserva confirmada",
    heading: "¡Tu reserva en Las Acacias está confirmada!",
    intro: (n) => `Hola ${n}, nos alegra recibirte. Acá tenés todos los detalles de tu estadía.`,
  },
  recordatorio_checkin: {
    subjectPrefix: "Tu estadía se acerca",
    heading: "Tu estadía en Las Acacias comienza próximamente",
    intro: (n) => `Hola ${n}, ¡ya falta poco! Te esperamos en Las Acacias.`,
  },
  recordatorio_checkout: {
    subjectPrefix: "Recordatorio de check-out",
    heading: "Recordá que mañana finaliza tu estadía",
    intro: (n) => `Hola ${n}, te recordamos que el check-out es de ${""}. ¡Esperamos que la hayas pasado increíble!`,
  },
  solicitud_resena: {
    subjectPrefix: "¿Cómo fue tu experiencia?",
    heading: "¿Cómo fue tu experiencia en Las Acacias?",
    intro: (n) => `Hola ${n}, nos encantaría conocer tu opinión sobre tu estadía en Las Acacias.`,
  },
};
