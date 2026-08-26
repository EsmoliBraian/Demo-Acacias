"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Cabin,
  CabinStatus,
  Guest,
  Offer,
  Reservation,
  ReservationSource,
  Conversation,
  ActivityEntry,
  ActivityType,
  Automation,
  Settings,
  PriceHistoryEntry,
  EmailLogEntry,
} from "@/lib/types";
import {
  cabins as initialCabins,
  guests as initialGuests,
  offers as initialOffers,
  initialReservations,
  conversations as initialConversations,
  initialActivity,
  automations as initialAutomations,
  initialSettings,
  priceHistory as initialPriceHistory,
} from "@/data/mockData";
import { nightsBetween, uid } from "@/lib/utils";

const STORAGE_KEY = "las-acacias-demo-state-v1";
const ADMIN_USER = "Administrador";

interface AppState {
  cabins: Cabin[];
  guests: Guest[];
  offers: Offer[];
  reservations: Reservation[];
  conversations: Conversation[];
  activity: ActivityEntry[];
  automations: Automation[];
  settings: Settings;
  priceHistory: PriceHistoryEntry[];
}

function initialState(): AppState {
  return {
    cabins: initialCabins,
    guests: initialGuests,
    offers: initialOffers,
    reservations: initialReservations,
    conversations: initialConversations,
    activity: initialActivity,
    automations: initialAutomations,
    settings: initialSettings,
    priceHistory: initialPriceHistory,
  };
}

export interface NewReservationInput {
  cabinId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  offerId: string | null;
  acceptedTerms: boolean;
  source?: ReservationSource;
}

export interface PricingBreakdown {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  discountAmount: number;
  offerLabel: string | null;
  total: number;
  deposit: number;
  balance: number;
}

interface AppContextValue extends AppState {
  getCabin: (id: string) => Cabin | undefined;
  getReservation: (id: string) => Reservation | undefined;
  getGuest: (id: string) => Guest | undefined;
  getActiveOffersForCabin: (cabinId: string) => Offer[];
  getFeaturedOffers: () => Offer[];
  computePricing: (
    cabinId: string,
    checkIn: string,
    checkOut: string,
    offerId: string | null
  ) => PricingBreakdown;
  createReservation: (input: NewReservationInput) => Reservation;
  markVoucherSent: (reservationId: string) => void;
  verifyTransfer: (reservationId: string) => void;
  confirmReservation: (reservationId: string) => void;
  rejectVoucher: (reservationId: string) => void;
  cancelReservation: (reservationId: string, reason: string) => void;
  changeCabin: (reservationId: string, newCabinId: string, reason: string) => void;
  updateCabinPrice: (
    cabinId: string,
    priceType: "base" | "finde" | "temporada_alta" | "temporada_baja",
    newValue: number,
    reason: string
  ) => void;
  updateCabinStatus: (cabinId: string, status: CabinStatus, reason: string) => void;
  createOffer: (offer: Omit<Offer, "id" | "timesUsed">) => void;
  updateOffer: (offerId: string, patch: Partial<Offer>) => void;
  toggleOfferStatus: (offerId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  toggleAutomation: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function offerLabelFor(offer: Offer): string {
  if (offer.type === "porcentaje") return `${offer.discountValue}% OFF`;
  if (offer.type === "precio_fijo") return `-$${offer.discountValue.toLocaleString("es-AR")}`;
  return "Noche gratis";
}

function nextReservationId(reservations: Reservation[]): string {
  const year = 2026;
  const nums = reservations
    .map((r) => parseInt(r.id.split("-")[2], 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 800;
  return `AC-${year}-${String(max + 1).padStart(4, "0")}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const logActivity = useCallback(
    (entry: Omit<ActivityEntry, "id" | "timestamp"> & { timestamp?: string }) => {
      const full: ActivityEntry = {
        id: uid("act"),
        timestamp: entry.timestamp ?? new Date().toISOString(),
        ...entry,
      };
      setState((s) => ({ ...s, activity: [full, ...s.activity] }));
    },
    []
  );

  const getCabin = useCallback((id: string) => state.cabins.find((c) => c.id === id), [state.cabins]);
  const getReservation = useCallback(
    (id: string) => state.reservations.find((r) => r.id === id),
    [state.reservations]
  );
  const getGuest = useCallback((id: string) => state.guests.find((g) => g.id === id), [state.guests]);

  const getActiveOffersForCabin = useCallback(
    (cabinId: string) => {
      return state.offers
        .filter((o) => o.status === "Activa")
        .filter((o) => o.applicableCabinIds === "all" || o.applicableCabinIds.includes(cabinId))
        .sort((a, b) => a.priority - b.priority);
    },
    [state.offers]
  );

  const getFeaturedOffers = useCallback(() => {
    return state.offers
      .filter((o) => o.status === "Activa" && o.featured)
      .sort((a, b) => a.priority - b.priority);
  }, [state.offers]);

  const computePricing = useCallback(
    (cabinId: string, checkIn: string, checkOut: string, offerId: string | null): PricingBreakdown => {
      const cabin = state.cabins.find((c) => c.id === cabinId);
      const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
      const pricePerNight = cabin?.basePrice ?? 0;
      const subtotal = pricePerNight * nights;
      const offer = offerId ? state.offers.find((o) => o.id === offerId) : null;

      let discountAmount = 0;
      let offerLabel: string | null = null;
      if (offer && nights >= offer.minNights) {
        offerLabel = offerLabelFor(offer);
        if (offer.type === "porcentaje") {
          discountAmount = Math.round(subtotal * (offer.discountValue / 100));
        } else if (offer.type === "precio_fijo") {
          discountAmount = Math.min(offer.discountValue, subtotal);
        } else if (offer.type === "noche_gratis") {
          discountAmount = pricePerNight;
        }
      }

      const total = Math.max(0, subtotal - discountAmount);
      const deposit = Math.round(total * 0.3);
      const balance = total - deposit;

      return { nights, pricePerNight, subtotal, discountAmount, offerLabel, total, deposit, balance };
    },
    [state.cabins, state.offers]
  );

  const createReservation = useCallback(
    (input: NewReservationInput): Reservation => {
      let created!: Reservation;
      setState((s) => {
        const pricing = (() => {
          const cabin = s.cabins.find((c) => c.id === input.cabinId);
          const nights = nightsBetween(input.checkIn, input.checkOut);
          const pricePerNight = cabin?.basePrice ?? 0;
          const subtotal = pricePerNight * nights;
          const offer = input.offerId ? s.offers.find((o) => o.id === input.offerId) : null;
          let discountAmount = 0;
          if (offer && nights >= offer.minNights) {
            if (offer.type === "porcentaje") discountAmount = Math.round(subtotal * (offer.discountValue / 100));
            else if (offer.type === "precio_fijo") discountAmount = Math.min(offer.discountValue, subtotal);
            else if (offer.type === "noche_gratis") discountAmount = pricePerNight;
          }
          const total = Math.max(0, subtotal - discountAmount);
          const deposit = Math.round(total * 0.3);
          const balance = total - deposit;
          return { nights, pricePerNight, subtotal, discountAmount, total, deposit, balance };
        })();

        let guest = s.guests.find(
          (g) => g.email.toLowerCase() === input.email.toLowerCase()
        );
        let guests = s.guests;
        if (!guest) {
          guest = {
            id: uid("guest"),
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            createdAt: new Date().toISOString(),
          };
          guests = [...s.guests, guest];
        }

        const id = nextReservationId(s.reservations);
        const reservation: Reservation = {
          id,
          guestId: guest.id,
          guestFirstName: input.firstName,
          guestLastName: input.lastName,
          guestEmail: input.email,
          guestPhone: input.phone,
          cabinId: input.cabinId,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          guestsCount: input.guestsCount,
          nights: pricing.nights,
          pricePerNight: pricing.pricePerNight,
          subtotal: pricing.subtotal,
          offerId: input.offerId,
          discountAmount: pricing.discountAmount,
          total: pricing.total,
          deposit: pricing.deposit,
          balance: pricing.balance,
          status: "Seña pendiente",
          paymentStatus: "Pendiente",
          source: input.source ?? "Web",
          createdAt: new Date().toISOString(),
          voucherUploadedAt: null,
          acceptedTerms: input.acceptedTerms,
          emailLog: s.settings.notifications.onCreate
            ? [
                {
                  id: uid("em"),
                  type: "reserva_recibida",
                  subject: `Recibimos tu reserva — Las Acacias | ${id}`,
                  recipient: input.email,
                  sentAt: new Date().toISOString(),
                },
              ]
            : [],
          cabinChanges: [],
        };

        created = reservation;

        return { ...s, guests, reservations: [reservation, ...s.reservations] };
      });

      logActivity({
        type: "Reserva creada",
        title: `Nueva reserva ${created.id}`,
        entity: "Reserva",
        entityId: created.id,
        after: `${created.guestFirstName} ${created.guestLastName} — ${created.checkIn} a ${created.checkOut}`,
        user: "Sistema (Web)",
      });

      return created;
    },
    [logActivity]
  );

  const updateReservation = useCallback(
    (id: string, patch: Partial<Reservation>) => {
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      }));
    },
    []
  );

  const markVoucherSent = useCallback(
    (reservationId: string) => {
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) => {
          if (r.id !== reservationId) return r;
          const emailLog: EmailLogEntry[] = s.settings.notifications.onVoucher
            ? [
                ...r.emailLog,
                {
                  id: uid("em"),
                  type: "comprobante_pendiente",
                  subject: `Recibimos tu comprobante — Las Acacias | ${r.id}`,
                  recipient: r.guestEmail,
                  sentAt: new Date().toISOString(),
                },
              ]
            : r.emailLog;
          return {
            ...r,
            status: "Comprobante pendiente",
            paymentStatus: "Comprobante pendiente",
            voucherUploadedAt: new Date().toISOString(),
            emailLog,
          };
        }),
      }));
      logActivity({
        type: "Comprobante recibido",
        title: `Comprobante recibido para ${reservationId}`,
        entity: "Reserva",
        entityId: reservationId,
        user: "Sistema (WhatsApp)",
      });
    },
    [logActivity]
  );

  const verifyTransfer = useCallback(
    (reservationId: string) => {
      updateReservation(reservationId, { status: "Seña verificada", paymentStatus: "Seña verificada" });
      logActivity({
        type: "Seña verificada",
        title: `Seña verificada para ${reservationId}`,
        entity: "Reserva",
        entityId: reservationId,
        user: ADMIN_USER,
      });
    },
    [updateReservation, logActivity]
  );

  const confirmReservation = useCallback(
    (reservationId: string) => {
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) => {
          if (r.id !== reservationId) return r;
          const emailLog: EmailLogEntry[] = s.settings.notifications.onConfirm
            ? [
                ...r.emailLog,
                {
                  id: uid("em"),
                  type: "reserva_confirmada",
                  subject: `Reserva confirmada — Las Acacias | ${r.id}`,
                  recipient: r.guestEmail,
                  sentAt: new Date().toISOString(),
                },
              ]
            : r.emailLog;
          return { ...r, status: "Confirmada", emailLog };
        }),
      }));
      logActivity({
        type: "Reserva confirmada",
        title: `Reserva ${reservationId} confirmada`,
        entity: "Reserva",
        entityId: reservationId,
        user: ADMIN_USER,
      });
      logActivity({
        type: "Email enviado",
        title: `Email de confirmación enviado (${reservationId})`,
        entity: "Reserva",
        entityId: reservationId,
        user: "Sistema",
      });
    },
    [logActivity]
  );

  const rejectVoucher = useCallback(
    (reservationId: string) => {
      updateReservation(reservationId, { status: "Seña pendiente", paymentStatus: "Pendiente", voucherUploadedAt: null });
      logActivity({
        type: "Reserva modificada",
        title: `Comprobante rechazado en ${reservationId}`,
        entity: "Reserva",
        entityId: reservationId,
        user: ADMIN_USER,
      });
    },
    [updateReservation, logActivity]
  );

  const cancelReservation = useCallback(
    (reservationId: string, reason: string) => {
      updateReservation(reservationId, { status: "Cancelada" });
      logActivity({
        type: "Reserva modificada",
        title: `Reserva ${reservationId} cancelada`,
        entity: "Reserva",
        entityId: reservationId,
        user: ADMIN_USER,
        reason,
      });
    },
    [updateReservation, logActivity]
  );

  const changeCabin = useCallback(
    (reservationId: string, newCabinId: string, reason: string) => {
      const reservation = state.reservations.find((r) => r.id === reservationId);
      const fromCabin = reservation ? state.cabins.find((c) => c.id === reservation.cabinId) : undefined;
      const toCabin = state.cabins.find((c) => c.id === newCabinId);
      if (!reservation || !fromCabin || !toCabin) return;

      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) => {
          if (r.id !== reservationId) return r;
          return {
            ...r,
            cabinId: newCabinId,
            cabinChanges: [
              {
                id: uid("cc"),
                date: new Date().toISOString(),
                fromCabinId: fromCabin.id,
                toCabinId: toCabin.id,
                user: ADMIN_USER,
                reason,
              },
              ...r.cabinChanges,
            ],
          };
        }),
      }));

      logActivity({
        type: "Cambio de cabaña",
        title: `${reservation.guestFirstName} ${reservation.guestLastName} movido de ${fromCabin.name} a ${toCabin.name}`,
        entity: "Reserva",
        entityId: reservationId,
        before: fromCabin.name,
        after: toCabin.name,
        user: ADMIN_USER,
        reason,
      });
    },
    [state.reservations, state.cabins, logActivity]
  );

  const updateCabinPrice = useCallback(
    (
      cabinId: string,
      priceType: "base" | "finde" | "temporada_alta" | "temporada_baja",
      newValue: number,
      reason: string
    ) => {
      const cabin = state.cabins.find((c) => c.id === cabinId);
      if (!cabin) return;
      const field =
        priceType === "base"
          ? "basePrice"
          : priceType === "finde"
          ? "weekendPrice"
          : priceType === "temporada_alta"
          ? "highSeasonPrice"
          : "lowSeasonPrice";
      const before = cabin[field];

      setState((s) => ({
        ...s,
        cabins: s.cabins.map((c) => (c.id === cabinId ? { ...c, [field]: newValue } : c)),
        priceHistory: [
          {
            id: uid("ph"),
            cabinId,
            before,
            after: newValue,
            priceType,
            date: new Date().toISOString(),
            user: ADMIN_USER,
            reason,
          },
          ...s.priceHistory,
        ],
      }));

      logActivity({
        type: "Cambio de precio",
        title: `${cabin.name} modificó su precio`,
        entity: "Cabaña",
        entityId: cabinId,
        before: `$${before.toLocaleString("es-AR")}`,
        after: `$${newValue.toLocaleString("es-AR")}`,
        user: ADMIN_USER,
        reason,
      });
    },
    [state.cabins, logActivity]
  );

  const updateCabinStatus = useCallback(
    (cabinId: string, status: CabinStatus, reason: string) => {
      const cabin = state.cabins.find((c) => c.id === cabinId);
      if (!cabin) return;
      const before = cabin.status;
      setState((s) => ({
        ...s,
        cabins: s.cabins.map((c) => (c.id === cabinId ? { ...c, status } : c)),
      }));
      logActivity({
        type: "Cambio de disponibilidad",
        title: `${cabin.name} cambió de estado`,
        entity: "Cabaña",
        entityId: cabinId,
        before,
        after: status,
        user: ADMIN_USER,
        reason,
      });
    },
    [state.cabins, logActivity]
  );

  const createOffer = useCallback(
    (offer: Omit<Offer, "id" | "timesUsed">) => {
      const id = uid("offer");
      setState((s) => ({ ...s, offers: [...s.offers, { ...offer, id, timesUsed: 0 }] }));
      logActivity({
        type: "Oferta creada",
        title: `Oferta “${offer.name}” creada`,
        entity: "Oferta",
        entityId: id,
        user: ADMIN_USER,
      });
    },
    [logActivity]
  );

  const updateOffer = useCallback(
    (offerId: string, patch: Partial<Offer>) => {
      const offer = state.offers.find((o) => o.id === offerId);
      if (!offer) return;
      setState((s) => ({ ...s, offers: s.offers.map((o) => (o.id === offerId ? { ...o, ...patch } : o)) }));
      logActivity({
        type: "Oferta modificada",
        title: `Oferta “${offer.name}” modificada`,
        entity: "Oferta",
        entityId: offerId,
        user: ADMIN_USER,
      });
    },
    [state.offers, logActivity]
  );

  const toggleOfferStatus = useCallback(
    (offerId: string) => {
      const offer = state.offers.find((o) => o.id === offerId);
      if (!offer) return;
      const nextStatus = offer.status === "Activa" ? "Pausada" : "Activa";
      setState((s) => ({
        ...s,
        offers: s.offers.map((o) => (o.id === offerId ? { ...o, status: nextStatus } : o)),
      }));
      logActivity({
        type: nextStatus === "Activa" ? "Oferta activada" : "Oferta desactivada",
        title: `Oferta “${offer.name}” ${nextStatus === "Activa" ? "activada" : "desactivada"}`,
        entity: "Oferta",
        entityId: offerId,
        user: ADMIN_USER,
      });
    },
    [state.offers, logActivity]
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: uid("m"), from: "admin" as const, text, time: new Date().toISOString() },
              ],
            }
          : c
      ),
    }));
  }, []);

  const toggleAutomation = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      automations: s.automations.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(initialState());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      getCabin,
      getReservation,
      getGuest,
      getActiveOffersForCabin,
      getFeaturedOffers,
      computePricing,
      createReservation,
      markVoucherSent,
      verifyTransfer,
      confirmReservation,
      rejectVoucher,
      cancelReservation,
      changeCabin,
      updateCabinPrice,
      updateCabinStatus,
      createOffer,
      updateOffer,
      toggleOfferStatus,
      sendMessage,
      toggleAutomation,
      updateSettings,
      resetDemo,
    }),
    [
      state,
      getCabin,
      getReservation,
      getGuest,
      getActiveOffersForCabin,
      getFeaturedOffers,
      computePricing,
      createReservation,
      markVoucherSent,
      verifyTransfer,
      confirmReservation,
      rejectVoucher,
      cancelReservation,
      changeCabin,
      updateCabinPrice,
      updateCabinStatus,
      createOffer,
      updateOffer,
      toggleOfferStatus,
      sendMessage,
      toggleAutomation,
      updateSettings,
      resetDemo,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
