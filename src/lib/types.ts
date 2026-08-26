export type CabinStatus = "Disponible" | "Ocupada" | "Mantenimiento" | "Inactiva";

export interface PriceHistoryEntry {
  id: string;
  cabinId: string;
  before: number;
  after: number;
  priceType: "base" | "finde" | "temporada_alta" | "temporada_baja";
  date: string;
  user: string;
  reason: string;
}

export interface Cabin {
  id: string;
  name: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  weekendPrice: number;
  highSeasonPrice: number;
  lowSeasonPrice: number;
  status: CabinStatus;
  amenities: string[];
  images: string[];
  description: string;
}

export type OfferType = "porcentaje" | "precio_fijo" | "noche_gratis";
export type OfferStatus = "Activa" | "Pausada" | "Programada";

export interface Offer {
  id: string;
  name: string;
  description: string;
  type: OfferType;
  discountValue: number;
  applicableCabinIds: string[] | "all";
  startDate: string;
  endDate: string;
  minNights: number;
  priority: number;
  featured: boolean;
  status: OfferStatus;
  timesUsed: number;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  notes?: string;
}

export type ReservationStatus =
  | "Reserva creada"
  | "Seña pendiente"
  | "Comprobante pendiente"
  | "Seña verificada"
  | "Confirmada"
  | "Check-in"
  | "Finalizada"
  | "Cancelada";

export type PaymentStatus =
  | "Pendiente"
  | "Comprobante pendiente"
  | "Seña verificada"
  | "Pagado"
  | "Reembolsado";

export type ReservationSource = "Web" | "WhatsApp" | "Directa" | "OTA";

export interface EmailLogEntry {
  id: string;
  type:
    | "reserva_recibida"
    | "comprobante_pendiente"
    | "reserva_confirmada"
    | "recordatorio_checkin"
    | "recordatorio_checkout"
    | "solicitud_resena";
  subject: string;
  recipient: string;
  sentAt: string;
}

export interface CabinChangeEntry {
  id: string;
  date: string;
  fromCabinId: string;
  toCabinId: string;
  user: string;
  reason: string;
}

export interface Reservation {
  id: string;
  guestId: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  cabinId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  offerId: string | null;
  discountAmount: number;
  total: number;
  deposit: number;
  balance: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  source: ReservationSource;
  createdAt: string;
  voucherUploadedAt: string | null;
  acceptedTerms: boolean;
  emailLog: EmailLogEntry[];
  cabinChanges: CabinChangeEntry[];
}

export interface Payment {
  reservationId: string;
  method: "Transferencia bancaria";
}

export interface ChatMessage {
  id: string;
  from: "guest" | "admin";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  guestName: string;
  channel: "WhatsApp" | "Web";
  messages: ChatMessage[];
  unread: number;
}

export type ActivityType =
  | "Reserva creada"
  | "Reserva modificada"
  | "Cambio de cabaña"
  | "Cambio de huésped"
  | "Cambio de precio"
  | "Pago registrado"
  | "Comprobante recibido"
  | "Seña verificada"
  | "Reserva confirmada"
  | "Oferta creada"
  | "Oferta modificada"
  | "Oferta activada"
  | "Oferta desactivada"
  | "Cambio de disponibilidad"
  | "Email enviado";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  entity: string;
  entityId: string;
  before?: string;
  after?: string;
  user: string;
  reason?: string;
  timestamp: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  active: boolean;
}

export interface BankData {
  bank: string;
  holder: string;
  cuit: string;
  cbu: string;
  alias: string;
}

export interface NotificationSettings {
  onCreate: boolean;
  onVoucher: boolean;
  onConfirm: boolean;
  reminderCheckin: boolean;
  reminderCheckout: boolean;
  reviewRequest: boolean;
}

export interface ComplexInfo {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  checkInWindow: string;
  checkOutWindow: string;
}

export interface Settings {
  complexInfo: ComplexInfo;
  bankData: BankData;
  cancellationPolicy: string;
  termsAndConditions: string;
  notifications: NotificationSettings;
}
