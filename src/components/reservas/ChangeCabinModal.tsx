"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Select, Textarea } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { Reservation } from "@/lib/types";

export function ChangeCabinModal({
  reservation,
  open,
  onClose,
}: {
  reservation: Reservation | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { cabins, getCabin, changeCabin } = useApp();
  const { showToast } = useToast();
  const [newCabinId, setNewCabinId] = useState("");
  const [reason, setReason] = useState("Solicitud del huésped");

  if (!open || !reservation) return null;
  const currentCabin = getCabin(reservation.cabinId);
  const options = cabins.filter((c) => c.id !== reservation.cabinId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Cambiar cabaña"
      subtitle={reservation.id}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!newCabinId}
            onClick={() => {
              const toCabin = cabins.find((c) => c.id === newCabinId);
              changeCabin(reservation.id, newCabinId, reason);
              showToast(
                `${reservation.guestFirstName} ${reservation.guestLastName} fue movido de ${currentCabin?.name} a ${toCabin?.name}.`
              );
              setNewCabinId("");
              setReason("Solicitud del huésped");
              onClose();
            }}
          >
            Confirmar cambio
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Huésped</Label>
            <p className="text-sm text-charcoal font-medium">
              {reservation.guestFirstName} {reservation.guestLastName}
            </p>
          </div>
          <div>
            <Label>Actualmente</Label>
            <p className="text-sm text-charcoal font-medium">{currentCabin?.name}</p>
          </div>
        </div>

        <div>
          <Label>Nueva cabaña</Label>
          <Select value={newCabinId} onChange={(e) => setNewCabinId(e.target.value)}>
            <option value="">Seleccioná una cabaña…</option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.status}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Motivo</Label>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
