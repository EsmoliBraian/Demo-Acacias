"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: string;
  message: string;
  description?: string;
  variant: "success" | "info";
}

interface ToastContextValue {
  showToast: (message: string, opts?: { description?: string; variant?: "success" | "info" }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, opts?: { description?: string; variant?: "success" | "info" }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, description: opts?.description, variant: opts?.variant ?? "success" }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3800);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto animate-slide-up flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm min-w-[260px] max-w-sm",
              "bg-white/95 border-forest/10"
            )}
          >
            {t.variant === "success" ? (
              <CheckCircle2 size={20} className="text-forest shrink-0 mt-0.5" />
            ) : (
              <Info size={20} className="text-olive shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal">{t.message}</p>
              {t.description && <p className="text-xs text-charcoal/60 mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
              className="text-charcoal/30 hover:text-charcoal/60 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
