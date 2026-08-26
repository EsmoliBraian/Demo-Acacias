"use client";

import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/lib/store";

export function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useApp();
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} size="md" title="Términos y condiciones">
      <p className="text-sm text-charcoal/70 leading-relaxed mb-5">{settings.termsAndConditions}</p>
      <div className="rounded-xl bg-forest/5 p-4">
        <p className="text-[11px] font-semibold text-forest/70 uppercase tracking-wide mb-1.5">Política de cancelación</p>
        <p className="text-xs text-charcoal/65 leading-relaxed">{settings.cancellationPolicy}</p>
      </div>
    </Modal>
  );
}
