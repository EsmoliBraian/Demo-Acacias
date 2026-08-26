"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/store";
import { cn, formatDateTime } from "@/lib/utils";

export default function MensajesPage() {
  const { conversations, sendMessage } = useApp();
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  return (
    <div>
      <PageHeader title="Mensajes" subtitle="Conversaciones simuladas de WhatsApp" />

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[280px_1fr] h-[600px]">
          <div className="border-b md:border-b-0 md:border-r border-forest/10 overflow-y-auto scroll-thin">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-full text-left px-4 py-3.5 border-b border-forest/6 flex items-center gap-3 transition-colors",
                  active?.id === c.id ? "bg-forest/6" : "hover:bg-forest/[0.03]"
                )}
              >
                <div className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-semibold shrink-0">
                  {c.guestName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal truncate">{c.guestName}</p>
                  <p className="text-xs text-charcoal/45 truncate">
                    {c.messages[c.messages.length - 1]?.text}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {active ? (
            <div className="flex flex-col min-h-0">
              <div className="px-5 py-3.5 border-b border-forest/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-semibold">
                  {active.guestName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{active.guestName}</p>
                  <p className="text-xs text-charcoal/45 flex items-center gap-1">
                    <MessageCircle size={11} /> {active.channel}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-3 bg-beige/30">
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.from === "admin" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        m.from === "admin" ? "bg-forest text-cream rounded-br-sm" : "bg-white text-charcoal rounded-bl-sm"
                      )}
                    >
                      <p>{m.text}</p>
                      <p className={cn("text-[10px] mt-1", m.from === "admin" ? "text-cream/50" : "text-charcoal/40")}>
                        {formatDateTime(m.time)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!text.trim()) return;
                  sendMessage(active.id, text.trim());
                  setText("");
                }}
                className="flex items-center gap-2 px-4 py-3 border-t border-forest/10"
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribí un mensaje…"
                  className="flex-1 rounded-full border border-forest/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/25"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-[#1c2c1b] transition-colors shrink-0"
                  aria-label="Enviar"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center text-charcoal/40 text-sm">Seleccioná una conversación</div>
          )}
        </div>
      </Card>
    </div>
  );
}
