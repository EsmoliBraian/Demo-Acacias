"use client";

import Image from "next/image";
import { CalendarDays, Users, Search } from "lucide-react";
import { Label, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { heroImages } from "@/data/mockData";

export interface SearchCriteria {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function Hero({
  criteria,
  onChange,
  onSearch,
  onReserveClick,
}: {
  criteria: SearchCriteria;
  onChange: (c: SearchCriteria) => void;
  onSearch: () => void;
  onReserveClick: () => void;
}) {
  return (
    <section id="inicio" className="relative pt-28 sm:pt-32 pb-40 sm:pb-48">
      <div className="absolute inset-0 -z-10">
        <Image src={heroImages[0]} alt="Las Acacias Cabañas" fill priority unoptimized className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-charcoal/50" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in">
          Naturaleza · Descanso · Confort
        </p>
        <h1 className="font-serif-display text-4xl sm:text-6xl text-white leading-[1.08] mb-5 max-w-2xl animate-slide-up">
          Tu escape natural
          <br />
          está <em className="text-gold not-italic font-serif-display italic">esperando</em>
        </h1>
        <p className="text-white/85 text-base sm:text-lg max-w-lg mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "80ms" }}>
          Cabañas exclusivas rodeadas de naturaleza, diseñadas para que desconectes, descanses y vivas momentos
          inolvidables.
        </p>
        <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "140ms" }}>
          <Button size="lg" onClick={onReserveClick}>
            Reservá tu estadía
          </Button>
          <a href="#cabanas">
            <Button size="lg" variant="outline" className="!border-white/40 !text-white hover:!bg-white/10">
              Conocé más
            </Button>
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 mt-14 sm:mt-16 relative sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:-bottom-16 sm:mt-0 w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 animate-scale-in" style={{ animationDelay: "220ms" }}>
          <p className="font-serif-display text-forest text-lg mb-1">Reservá tu estadía</p>
          <p className="text-xs text-charcoal/50 mb-4">Viví una experiencia única en Las Acacias</p>
          <div className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3">
            <div>
              <Label>Check-in</Label>
              <div className="relative">
                <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
                <Input
                  type="date"
                  value={criteria.checkIn}
                  onChange={(e) => onChange({ ...criteria, checkIn: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Check-out</Label>
              <div className="relative">
                <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
                <Input
                  type="date"
                  value={criteria.checkOut}
                  min={criteria.checkIn}
                  onChange={(e) => onChange({ ...criteria, checkOut: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Huéspedes</Label>
              <div className="relative">
                <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
                <Select
                  value={criteria.guests}
                  onChange={(e) => onChange({ ...criteria, guests: Number(e.target.value) })}
                  className="pl-9"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "adulto" : "adultos"}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Button size="md" onClick={onSearch} className="w-full sm:w-auto self-end" icon={<Search size={16} />}>
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
