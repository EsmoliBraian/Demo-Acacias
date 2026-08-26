"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero, type SearchCriteria } from "@/components/landing/Hero";
import { FeaturesStrip } from "@/components/landing/FeaturesStrip";
import { OffersSection } from "@/components/landing/OffersSection";
import { AvailabilitySection } from "@/components/landing/AvailabilitySection";
import { AmbienceSection } from "@/components/landing/AmbienceSection";
import { LocationSection } from "@/components/landing/LocationSection";
import { Footer } from "@/components/landing/Footer";
import { BookingFlow } from "@/components/landing/BookingFlow";

function defaultDates() {
  const checkIn = new Date(2026, 8, 15);
  const checkOut = new Date(2026, 8, 18);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { checkIn: toISO(checkIn), checkOut: toISO(checkOut) };
}

export default function Home() {
  const [criteria, setCriteria] = useState<SearchCriteria>({ ...defaultDates(), guests: 2 });
  const [searched, setSearched] = useState(false);
  const [bookingCabinId, setBookingCabinId] = useState<string | null>(null);

  const scrollToWidget = () => {
    document.getElementById("motor-reservas")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSearch = () => {
    setSearched(true);
    document.getElementById("cabanas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header onReserveClick={scrollToWidget} />

      <main>
        <div id="motor-reservas">
          <Hero criteria={criteria} onChange={setCriteria} onSearch={handleSearch} onReserveClick={scrollToWidget} />
        </div>

        <div className="h-16 sm:h-20" />

        <FeaturesStrip />
        <OffersSection />
        <AvailabilitySection searched={searched} criteria={criteria} onSelectCabin={setBookingCabinId} />
        <AmbienceSection />
        <LocationSection />
      </main>

      <Footer />

      {bookingCabinId && (
        <BookingFlow
          open={!!bookingCabinId}
          onClose={() => setBookingCabinId(null)}
          cabinId={bookingCabinId}
          checkIn={criteria.checkIn}
          checkOut={criteria.checkOut}
          guests={criteria.guests}
        />
      )}
    </>
  );
}
