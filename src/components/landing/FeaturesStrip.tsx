import { Home, Waves, Flame, Trees, Wifi } from "lucide-react";

const features = [
  { icon: Home, title: "Cabañas equipadas", desc: "Confort premium en plena naturaleza." },
  { icon: Waves, title: "Pileta al aire libre", desc: "Disfrutá del sol y la tranquilidad." },
  { icon: Flame, title: "Parrillas privadas", desc: "Espacios ideales para compartir." },
  { icon: Trees, title: "Entorno natural", desc: "Aire puro, verde y la mejor energía." },
  { icon: Wifi, title: "WiFi y servicios", desc: "Conectividad sin perder la paz." },
];

export function FeaturesStrip() {
  return (
    <section className="py-16 sm:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-center text-xs tracking-[0.25em] uppercase text-olive mb-2">🌿 Bienvenidos</p>
        <h2 className="text-center font-serif-display text-2xl sm:text-3xl text-forest mb-12">
          Todo lo que necesitás para desconectar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 sm:gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-forest/6 text-forest flex items-center justify-center mx-auto mb-4">
                <f.icon size={22} strokeWidth={1.6} />
              </div>
              <p className="text-sm font-medium text-charcoal mb-1">{f.title}</p>
              <p className="text-xs text-charcoal/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
