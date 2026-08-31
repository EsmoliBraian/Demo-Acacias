"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label, Input, Textarea, Switch } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export default function ConfiguracionPage() {
  const { settings, updateSettings } = useApp();
  const { showToast } = useToast();

  const [complexInfo, setComplexInfo] = useState(settings.complexInfo);
  const [bankData, setBankData] = useState(settings.bankData);
  const [cancellationPolicy, setCancellationPolicy] = useState(settings.cancellationPolicy);
  const [termsAndConditions, setTermsAndConditions] = useState(settings.termsAndConditions);

  const save = (patch: Parameters<typeof updateSettings>[0], label: string) => {
    updateSettings(patch);
    showToast(`${label} actualizada correctamente.`);
  };

  const notifLabels: { key: keyof typeof settings.notifications; label: string }[] = [
    { key: "onCreate", label: "Email al crear reserva" },
    { key: "onVoucher", label: "Email al recibir comprobante" },
    { key: "onConfirm", label: "Email al confirmar reserva" },
    { key: "reminderCheckin", label: "Recordatorio de check-in" },
    { key: "reminderCheckout", label: "Recordatorio de checkout" },
    { key: "reviewRequest", label: "Solicitud de reseña" },
  ];

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Todo lo que alimenta la web pública y el flujo de reservas" />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Información del complejo</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3.5">
            <div>
              <Label>Nombre</Label>
              <Input value={complexInfo.name} onChange={(e) => setComplexInfo({ ...complexInfo, name: e.target.value })} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={complexInfo.address} onChange={(e) => setComplexInfo({ ...complexInfo, address: e.target.value })} />
            </div>
            <div>
              <Label>Link de Google Maps</Label>
              <Input value={complexInfo.mapsUrl} onChange={(e) => setComplexInfo({ ...complexInfo, mapsUrl: e.target.value })} />
              <p className="text-[11px] text-charcoal/45 mt-1">Se usa en el botón "Cómo llegar" de la web pública.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Teléfono</Label>
                <Input value={complexInfo.phone} onChange={(e) => setComplexInfo({ ...complexInfo, phone: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={complexInfo.email} onChange={(e) => setComplexInfo({ ...complexInfo, email: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Horario de atención</Label>
              <Input value={complexInfo.hours} onChange={(e) => setComplexInfo({ ...complexInfo, hours: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Check-in</Label>
                <Input value={complexInfo.checkInWindow} onChange={(e) => setComplexInfo({ ...complexInfo, checkInWindow: e.target.value })} />
              </div>
              <div>
                <Label>Check-out</Label>
                <Input value={complexInfo.checkOutWindow} onChange={(e) => setComplexInfo({ ...complexInfo, checkOutWindow: e.target.value })} />
              </div>
            </div>
            <Button size="sm" onClick={() => save({ complexInfo }, "Información del complejo")}>
              Guardar cambios
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3.5">
            <div>
              <Label>Número de WhatsApp (con código de país, sin +)</Label>
              <Input
                value={complexInfo.whatsapp}
                onChange={(e) => setComplexInfo({ ...complexInfo, whatsapp: e.target.value })}
              />
            </div>
            <p className="text-xs text-charcoal/50">
              Este número se usa para generar el enlace de envío de comprobante desde la web pública.
            </p>
            <Button size="sm" onClick={() => save({ complexInfo }, "Configuración de WhatsApp")}>
              Guardar cambios
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos bancarios</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3.5">
            <div>
              <Label>Banco</Label>
              <Input value={bankData.bank} onChange={(e) => setBankData({ ...bankData, bank: e.target.value })} />
            </div>
            <div>
              <Label>Titular</Label>
              <Input value={bankData.holder} onChange={(e) => setBankData({ ...bankData, holder: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>CUIT</Label>
                <Input value={bankData.cuit} onChange={(e) => setBankData({ ...bankData, cuit: e.target.value })} />
              </div>
              <div>
                <Label>Alias</Label>
                <Input value={bankData.alias} onChange={(e) => setBankData({ ...bankData, alias: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>CBU</Label>
              <Input value={bankData.cbu} onChange={(e) => setBankData({ ...bankData, cbu: e.target.value })} />
            </div>
            <Button size="sm" onClick={() => save({ bankData }, "Datos bancarios")}>
              Guardar cambios
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {notifLabels.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-charcoal">{label}</span>
                <Switch
                  checked={settings.notifications[key]}
                  onChange={(v) => {
                    updateSettings({ notifications: { ...settings.notifications, [key]: v } });
                  }}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Política de cancelación</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3.5">
            <Textarea rows={4} value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} />
            <p className="text-xs text-charcoal/50">
              Se muestra en la pantalla de reserva, antes de confirmar, en el dashboard y en el email de confirmación.
            </p>
            <Button size="sm" onClick={() => save({ cancellationPolicy }, "Política de cancelación")}>
              Guardar cambios
            </Button>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Términos y condiciones</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3.5">
            <Textarea rows={4} value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} />
            <Button size="sm" onClick={() => save({ termsAndConditions }, "Términos y condiciones")}>
              Guardar cambios
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
