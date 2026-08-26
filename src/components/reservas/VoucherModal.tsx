"use client";

import { Receipt, Building2, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { Reservation } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function VoucherModal({
  reservation,
  open,
  onClose,
}: {
  reservation: Reservation | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { verifyTransfer, rejectVoucher, settings } = useApp();
  const { showToast } = useToast();

  if (!open || !reservation) return null;

  const alreadyVerified = reservation.status !== "Comprobante pendiente";

  return (
    <Modal open={open} onClose={onClose} size="sm" title="Comprobante de transferencia" subtitle={reservation.id}>
      <div className="rounded-2xl border-2 border-dashed border-forest/20 bg-forest/[0.03] p-6 text-center mb-5">
        <Receipt size={30} className="mx-auto text-forest/50 mb-3" />
        <p className="text-sm font-medium text-charcoal mb-1">Comprobante de transferencia bancaria</p>
        <p className="text-xs text-charcoal/50">
          Recibido {reservation.voucherUploadedAt ? formatDateTime(reservation.voucherUploadedAt) : "—"}
        </p>
        <div className="mt-4 bg-white rounded-xl border border-forest/10 p-4 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-charcoal/50">Banco emisor</span>
            <span className="text-charcoal">Banco Nación Arg.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50">Destino</span>
            <span className="text-charcoal">{settings.bankData.alias}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50">Concepto</span>
            <span className="text-charcoal font-mono">{reservation.id}</span>
          </div>
          <div className="flex justify-between font-semibold pt-1.5 border-t border-forest/10 mt-1.5">
            <span className="text-charcoal/60">Monto transferido</span>
            <span className="text-forest">{formatCurrency(reservation.deposit)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-charcoal/50 mb-5">
        <Building2 size={14} />
        Comprobante simulado con fines de demostración.
      </div>

      {alreadyVerified ? (
        <div className="flex items-center gap-2 text-sm text-forest bg-forest/8 rounded-xl px-4 py-3">
          <CheckCircle2 size={16} /> Este comprobante ya fue verificado.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            className="flex-1"
            onClick={() => {
              verifyTransfer(reservation.id);
              showToast("Seña verificada correctamente.");
              onClose();
            }}
          >
            Confirmar transferencia
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              rejectVoucher(reservation.id);
              showToast("Comprobante rechazado", { variant: "info", description: "Se notificó al huésped." });
              onClose();
            }}
          >
            Rechazar comprobante
          </Button>
        </div>
      )}
    </Modal>
  );
}
