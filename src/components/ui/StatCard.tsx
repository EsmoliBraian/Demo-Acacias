"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

export function StatCard({
  label,
  value,
  numeric,
  suffix = "",
  prefix = "",
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value?: string;
  numeric?: number;
  suffix?: string;
  prefix?: string;
  delta?: number;
  icon?: LucideIcon;
  hint?: string;
}) {
  const animated = useCountUp(numeric ?? 0);
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="bg-white rounded-2xl border border-forest/10 p-5 shadow-[0_1px_2px_rgba(17,21,15,0.04),0_8px_24px_-12px_rgba(17,21,15,0.08)] animate-slide-up">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-charcoal/55 tracking-wide uppercase">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-forest/8 flex items-center justify-center text-forest shrink-0">
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="font-serif-display text-2xl md:text-3xl text-charcoal mt-2">
        {value ?? `${prefix}${animated.toLocaleString("es-AR")}${suffix}`}
      </p>
      <div className="flex items-center gap-2 mt-2">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-forest" : "text-red-600"
            )}
          >
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-xs text-charcoal/45">{hint}</span>}
      </div>
    </div>
  );
}
