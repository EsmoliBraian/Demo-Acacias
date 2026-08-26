import Image from "next/image";
import { ambienceImages } from "@/data/mockData";

export function AmbienceSection() {
  return (
    <section id="servicios" className="py-16 sm:py-24 bg-beige/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs tracking-[0.25em] uppercase text-olive mb-3">Experiencias</p>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-forest mb-5 leading-tight">
              Un entorno pensado para el descanso absoluto
            </h2>
            <p className="text-charcoal/65 leading-relaxed mb-6">
              Pileta al aire libre, parque forestado, parrillas privadas y un club house para compartir con quienes
              más querés. Cada rincón de Las Acacias está diseñado para que el tiempo se detenga.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Pileta panorámica", desc: "Con vista al bosque de acacias" },
                { label: "Parque de 8 hectáreas", desc: "Senderos y áreas verdes" },
                { label: "Club house", desc: "Espacio social y de eventos" },
                { label: "Parrillas privadas", desc: "En cada cabaña" },
              ].map((f) => (
                <div key={f.label} className="border-l-2 border-gold/60 pl-3.5">
                  <p className="text-sm font-medium text-charcoal">{f.label}</p>
                  <p className="text-xs text-charcoal/50 mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="relative h-64 rounded-2xl overflow-hidden col-span-2">
              <Image src={ambienceImages.pool} alt="Pileta Las Acacias" fill unoptimized className="object-cover" />
            </div>
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src={ambienceImages.park} alt="Parque Las Acacias" fill unoptimized className="object-cover" />
            </div>
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src={ambienceImages.clubHouse} alt="Club House Las Acacias" fill unoptimized className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
