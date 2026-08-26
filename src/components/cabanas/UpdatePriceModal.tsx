"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import type { Cabin } from "@/lib/types";

const priceFieldLabel: Record<string, string> = {
  base: "Precio base",
  finde: "Fin de semana",
  temporada_alta: "Temporada alta",
  temporada_baja: "Temporada baja",
};

const priceFieldKey: Record<string, keyof Cabin> = {
  base: "basePrice",
  finde: "weekendPrice",
  temporada_alta: "highSeasonPrice",
  temporada_baja: "lowSeasonPrice",
};

export function UpdatePriceModal({
  cabin,
  priceType,
  open,
  onClose,
}: {
  cabin: Cabin | undefined;
  priceType: "base" | "finde" | "temporada_alta" | "temporada_baja" | null;
  open: boolean;
  onClose: () => void;
}) {
  const { updateCabinPrice } = useApp();
  const { showToast } = useToast();
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("Actualización de temporada");

  const current = cabin && priceType ? (cabin[priceFieldKey[priceType]] as number) : 0;

  useEffect(() => {
    if (open) setValue(String(current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || !cabin || !priceType) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Modificar precio"
      subtitle={`${cabin.name} — ${priceFieldLabel[priceType]}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              const newValue = Number(value);
              if (!newValue || newValue <= 0) return;
              updateCabinPrice(cabin.id, priceType, newValue, reason);
              showToast(`${cabin.name} actualizó su precio a ${formatCurrency(newValue)}.`);
              onClose();
            }}
          >
            Guardar nuevo precio
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Precio actual</Label>
          <p className="text-lg font-serif-display text-charcoal/60">{formatCurrency(current)}</p>
        </div>
        <div>
          <Label>Nuevo precio</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <Label>Motivo</Label>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
