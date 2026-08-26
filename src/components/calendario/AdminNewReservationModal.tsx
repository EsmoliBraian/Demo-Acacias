"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Input, Select } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { useUI } from "@/lib/uiStore";
import { formatCurrency } from "@/lib/utils";

export function AdminNewReservationModal({
  open,
  onClose,
  defaultCabinId,
}: {
  open: boolean;
  onClose: () => void;
  defaultCabinId?: string;
}) {
  const { cabins, computePricing, createReservation } = useApp();
  const { showToast } = useToast();
  const { openReservation } = useUI();

  const [cabinId, setCabinId] = useState(defaultCabinId ?? cabins[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!open) return null;

  const pricing = checkIn && checkOut ? computePricing(cabinId, checkIn, checkOut, null) : null;
  const canSubmit = cabinId && checkIn && checkOut && firstName && lastName && email && phone;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Nueva reserva"
      subtitle="Carga manual desde el panel administrativo"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => {
              const r = createReservation({
                cabinId,
                checkIn,
                checkOut,
                guestsCount,
                firstName,
                lastName,
                email,
                phone,
                offerId: null,
                acceptedTerms: true,
                source: "Directa",
              });
              showToast(`Reserva ${r.id} creada correctamente.`);
              onClose();
              openReservation(r.id);
            }}
          >
            Crear reserva
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Cabaña</Label>
          <Select value={cabinId} onChange={(e) => setCabinId(e.target.value)}>
            {cabins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.status}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Check-in</Label>
            <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div>
            <Label>Check-out</Label>
            <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn} />
          </div>
        </div>
        <div>
          <Label>Huéspedes</Label>
          <Input type="number" min={1} value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Nombre</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label>Apellido</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        {pricing && (
          <div className="rounded-xl bg-forest/5 p-4 text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-charcoal/60">
                {pricing.nights} noche{pricing.nights === 1 ? "" : "s"}
              </span>
              <span className="text-charcoal">{formatCurrency(pricing.total)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-charcoal/60">Seña (30%)</span>
              <span className="text-forest">{formatCurrency(pricing.deposit)}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
