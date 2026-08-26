"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Field";
import { activityIconMap } from "@/components/dashboard/ActivityIcon";
import { useApp } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import type { ActivityType } from "@/lib/types";

const ALL = "Todos";

export default function HistorialPage() {
  const { activity } = useApp();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ActivityType | typeof ALL>(ALL);
  const [user, setUser] = useState<string>(ALL);

  const types = useMemo(() => [ALL, ...Array.from(new Set(activity.map((a) => a.type)))], [activity]);
  const users = useMemo(() => [ALL, ...Array.from(new Set(activity.map((a) => a.user)))], [activity]);

  const filtered = activity
    .filter((a) => type === ALL || a.type === type)
    .filter((a) => user === ALL || a.user === user)
    .filter((a) => {
      const q = query.toLowerCase();
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.entityId.toLowerCase().includes(q);
    });

  return (
    <div>
      <PageHeader
        title="Historial y auditoría"
        subtitle="Todo lo que cambia en el sistema queda registrado: qué, quién, cuándo y por qué"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35" />
          <Input placeholder="Buscar en el historial…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value as ActivityType | typeof ALL)} className="sm:w-56">
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select value={user} onChange={(e) => setUser(e.target.value)} className="sm:w-48">
          {users.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
      </div>

      <Card className="p-0 divide-y divide-forest/8">
        {filtered.length === 0 && <p className="text-sm text-charcoal/45 px-5 py-6">No se encontraron eventos.</p>}
        {filtered.map((a) => {
          const { icon: Icon, tone } = activityIconMap[a.type];
          return (
            <div key={a.id} className="flex gap-4 px-5 py-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-medium text-charcoal">{a.title}</p>
                  <span className="text-[10px] uppercase tracking-wide text-charcoal/40 bg-charcoal/5 px-1.5 py-0.5 rounded">
                    {a.type}
                  </span>
                </div>
                <p className="text-xs text-charcoal/45 mt-1">
                  {a.user} · {formatDateTime(a.timestamp)} · {a.entity} {a.entityId}
                </p>
                {(a.before || a.after || a.reason) && (
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs">
                    {a.before && (
                      <span className="text-charcoal/50">
                        Antes: <span className="text-charcoal/75">{a.before}</span>
                      </span>
                    )}
                    {a.after && (
                      <span className="text-charcoal/50">
                        Después: <span className="text-charcoal/75">{a.after}</span>
                      </span>
                    )}
                    {a.reason && (
                      <span className="text-charcoal/50">
                        Motivo: <span className="text-charcoal/75">{a.reason}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
