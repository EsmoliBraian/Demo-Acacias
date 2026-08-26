"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Input, Select, Textarea, Switch } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { Offer, OfferType } from "@/lib/types";

const empty = {
  name: "",
  description: "",
  type: "porcentaje" as OfferType,
  discountValue: 15,
  applicableCabinIds: "all" as Offer["applicableCabinIds"],
  startDate: "",
  endDate: "",
  minNights: 1,
  priority: 3,
  featured: false,
  status: "Activa" as Offer["status"],
};

export function OfferFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cabins, createOffer } = useApp();
  const { showToast } = useToast();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (open) setForm(empty);
  }, [open]);

  if (!open) return null;

  const cabinIds = form.applicableCabinIds;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Crear oferta"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!form.name || !form.startDate || !form.endDate}
            onClick={() => {
              createOffer(form);
              showToast(`Oferta “${form.name}” creada.`);
              onClose();
            }}
          >
            Crear oferta
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Nombre</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Escapada de fin de semana" />
        </div>
        <div>
          <Label>Descripción</Label>
          <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tipo</Label>
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as OfferType })}>
              <option value="porcentaje">Porcentaje</option>
              <option value="precio_fijo">Precio fijo</option>
              <option value="noche_gratis">Noche gratis</option>
            </Select>
          </div>
          <div>
            <Label>{form.type === "porcentaje" ? "Descuento (%)" : form.type === "precio_fijo" ? "Descuento ($)" : "Noches gratis"}</Label>
            <Input
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <Label>Cabañas aplicables</Label>
          <Select
            value={cabinIds === "all" ? "all" : "custom"}
            onChange={(e) => setForm({ ...form, applicableCabinIds: e.target.value === "all" ? "all" : [] })}
          >
            <option value="all">Todas las cabañas</option>
            <option value="custom">Seleccionar cabañas</option>
          </Select>
          {cabinIds !== "all" && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cabins.map((c) => {
                const active = Array.isArray(cabinIds) && cabinIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      const list = Array.isArray(cabinIds) ? cabinIds : [];
                      setForm({
                        ...form,
                        applicableCabinIds: active ? list.filter((id) => id !== c.id) : [...list, c.id],
                      });
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      active ? "bg-forest text-cream border-forest" : "border-forest/20 text-charcoal/60"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fecha inicio</Label>
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <Label>Fecha final</Label>
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Mínimo de noches</Label>
            <Input type="number" min={1} value={form.minNights} onChange={(e) => setForm({ ...form, minNights: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Prioridad</Label>
            <Input type="number" min={1} value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-forest/10 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-charcoal">⭐ Destacada</p>
            <p className="text-xs text-charcoal/50">Aparece primero en la landing</p>
          </div>
          <Switch checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
        </div>

        <div>
          <Label>Estado</Label>
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Offer["status"] })}>
            <option value="Activa">Activa</option>
            <option value="Pausada">Pausada</option>
            <option value="Programada">Programada</option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
