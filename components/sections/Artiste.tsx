import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

export function Artiste() {
  return (
    <section id="artiste" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 md:grid-cols-12 md:gap-16 md:px-8">
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
            <Image
              src="https://picsum.photos/seed/perfumer-portrait-chiaroscuro/900/1125"
              alt="Portrait de Margaux Vasseur dans son atelier, lumière en clair-obscur."
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale-[0.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          </div>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7 md:self-center">
          <Reveal>
            <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-bone">
              Deux ans sans rien sentir. Puis tout, à nouveau.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 max-w-[58ch] space-y-5 text-[1.05rem] leading-relaxed text-bone-dim">
              <p>
                Formée à Grasse, Margaux Vasseur a perdu l'odorat pendant deux
                ans. Un monde entier s'est éteint, sans prévenir et sans
                explication claire.
              </p>
              <p>
                Quand il est revenu, lentement, plus rien n'était neutre. Une
                cage d'escalier, une pluie, un atelier de menuiserie : chaque
                odeur portait soudain un lieu et une date.
              </p>
              <p>
                Elle compose depuis son atelier marseillais des parfums qui ne
                cherchent pas à plaire, mais à rouvrir un endroit précis. C'est
                de cette traversée qu'est née la Maison.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
