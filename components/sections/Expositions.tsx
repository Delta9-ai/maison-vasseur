import { Reveal } from "@/components/motion/Reveal";
import { WorldMap } from "@/components/ui/map";

type Escale = {
  ville: string;
  pays: string;
  lat: number;
  lng: number;
  date: string;
  titre: string;
  lieu: string;
};

// Itinéraire : un parfum naît sur place, à chaque escale.
const escales: Escale[] = [
  {
    ville: "Marseille",
    pays: "France",
    lat: 43.2965,
    lng: 5.3698,
    date: "Mars 2024",
    titre: "L'air d'ici, duo",
    lieu: "FRAC PACA",
  },
  {
    ville: "Reykjavík",
    pays: "Islande",
    lat: 64.1466,
    lng: -21.9426,
    date: "Août 2024",
    titre: "Neige sèche",
    lieu: "Kling & Bang",
  },
  {
    ville: "New York",
    pays: "États-Unis",
    lat: 40.7128,
    lng: -74.006,
    date: "Janv. 2025",
    titre: "Portraits de lieux",
    lieu: "The Shed",
  },
  {
    ville: "Mexico",
    pays: "Mexique",
    lat: 19.4326,
    lng: -99.1332,
    date: "Mai 2025",
    titre: "Mémoire de l'air",
    lieu: "Museo Tamayo",
  },
  {
    ville: "São Paulo",
    pays: "Brésil",
    lat: -23.5505,
    lng: -46.6333,
    date: "Oct. 2025",
    titre: "Saison fauve",
    lieu: "Pinacoteca",
  },
  {
    ville: "Le Cap",
    pays: "Afrique du Sud",
    lat: -33.9249,
    lng: 18.4241,
    date: "Févr. 2026",
    titre: "Vent du large",
    lieu: "Zeitz MOCAA",
  },
  {
    ville: "Mumbai",
    pays: "Inde",
    lat: 19.076,
    lng: 72.8777,
    date: "Sept. 2026",
    titre: "Mousson",
    lieu: "Jhaveri Contemporary",
  },
  {
    ville: "Kyoto",
    pays: "Japon",
    lat: 35.0116,
    lng: 135.7681,
    date: "Mars 2027",
    titre: "Résidence olfactive",
    lieu: "Kyoto Art Center",
  },
];

// Segments du trajet (escale -> escale suivante). Étiquettes dédupliquées :
// seulement sur le départ de chaque segment, plus l'arrivée du tout dernier.
const dots = escales.slice(0, -1).map((s, i) => ({
  start: { lat: s.lat, lng: s.lng, label: s.ville },
  end: {
    lat: escales[i + 1].lat,
    lng: escales[i + 1].lng,
    label: i === escales.length - 2 ? escales[i + 1].ville : undefined,
  },
}));

export function Expositions() {
  return (
    <section id="expositions" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-bone">
              Expositions et rendez-vous
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-bone-dim">
              Un lieu, un parfum. Le travail voyage et chaque escale devient
              une œuvre née sur place, du grand nord aux tropiques.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="text-sm text-vetiver">Itinéraire 2024 — 2027</p>
            <p className="mt-1 text-sm text-bone-dim">
              Huit escales, cinq continents
            </p>
          </div>
        </div>

        {/* Le trajet, tracé sur la carte du monde */}
        <Reveal y={24} className="mt-12">
          <WorldMap dots={dots} lineColor="#3a8f63" />
        </Reveal>

        {/* Itinéraire détaillé */}
        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {escales.map((s, i) => (
            <Reveal
              key={s.ville}
              y={18}
              className="border-t border-line pt-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs tracking-wide text-vetiver">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-bone-dim">{s.date}</span>
              </div>
              <p className="mt-3 font-display text-lg font-medium leading-tight tracking-tight text-bone">
                {s.titre}
              </p>
              <p className="mt-1.5 text-sm text-bone-dim">
                {s.ville}, {s.pays}
              </p>
              <p className="text-xs text-bone-faint">{s.lieu}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
