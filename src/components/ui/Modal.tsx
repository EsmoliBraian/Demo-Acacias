"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-cream rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-scale-in",
          widths[size]
        )}
      >
        {title && (
          <div className="px-6 py-5 border-b border-forest/10 flex items-start justify-between gap-4 shrink-0">
            <div>
              <h2 className="font-serif-display text-xl text-forest">{title}</h2>
              {subtitle && <p className="text-sm text-charcoal/60 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-charcoal/40 hover:text-charcoal/70 transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto scroll-thin px-6 py-5 flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-forest/10 flex justify-end gap-3 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
