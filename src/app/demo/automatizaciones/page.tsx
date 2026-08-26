"use client";

import { Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Field";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export default function AutomatizacionesPage() {
  const { automations, toggleAutomation } = useApp();
  const { showToast } = useToast();

  return (
    <div>
      <PageHeader title="Automatizaciones" subtitle="Mensajes y emails que el sistema dispara automáticamente" />

      <div className="grid sm:grid-cols-2 gap-4">
        {automations.map((a) => (
          <Card key={a.id} className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-forest/8 text-forest flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-charcoal text-sm">{a.name}</h3>
                <Switch
                  checked={a.active}
                  onChange={() => {
                    toggleAutomation(a.id);
                    showToast(`${a.name} ${a.active ? "desactivada" : "activada"}.`, { variant: "info" });
                  }}
                />
              </div>
              <p className="text-xs text-charcoal/55 mt-1.5 leading-relaxed">{a.description}</p>
              <p className="text-[11px] text-charcoal/40 mt-2 uppercase tracking-wide">Trigger: {a.trigger}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
