"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { UIProvider } from "@/lib/uiStore";
import { ReservationDetailModal } from "@/components/reservas/ReservationDetailModal";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <UIProvider>
      <div className="flex min-h-screen bg-beige/40">
        <Sidebar />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">{children}</main>
        </div>
      </div>
      <ReservationDetailModal />
    </UIProvider>
  );
}
