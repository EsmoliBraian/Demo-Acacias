"use client";

import React, { createContext, useContext, useState } from "react";

interface UIContextValue {
  openReservationId: string | null;
  openReservation: (id: string) => void;
  closeReservation: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [openReservationId, setOpenReservationId] = useState<string | null>(null);

  return (
    <UIContext.Provider
      value={{
        openReservationId,
        openReservation: (id) => setOpenReservationId(id),
        closeReservation: () => setOpenReservationId(null),
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}
