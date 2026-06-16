import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Manifeste } from "@/components/sections/Manifeste";
import { Oeuvres } from "@/components/sections/Oeuvres";
import { Processus } from "@/components/sections/Processus";
import { Artiste } from "@/components/sections/Artiste";
import { Matieres } from "@/components/sections/Matieres";
import { Expositions } from "@/components/sections/Expositions";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifeste />
        <Oeuvres />
        <Processus />
        <Artiste />
        <Matieres />
        <Expositions />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
