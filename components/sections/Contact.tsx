"use client";

import { useState } from "react";
import { CircleNotch, Check } from "@phosphor-icons/react";

type Status = "idle" | "loading" | "success";
type Errors = { nom?: string; email?: string; message?: string };

const field =
  "w-full border border-line bg-ink-2/40 px-4 py-3 text-bone placeholder:text-bone-faint transition-colors focus:border-vetiver focus:outline-none";
const label = "mb-2 block text-sm text-bone-dim";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nom = String(data.get("nom") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const next: Errors = {};
    if (!nom) next.nom = "Indiquez votre nom.";
    if (!email) next.email = "Indiquez une adresse.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Cette adresse semble incomplète.";
    if (!message) next.message = "Écrivez quelques mots.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 1100);
  }

  return (
    <section id="contact" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 md:grid-cols-12 md:gap-16 md:px-8">
        <div className="md:col-span-5">
          <h2 className="max-w-[14ch] font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1] tracking-tight text-bone">
            Parlons d'un lieu
          </h2>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-bone-dim">
            Pour une commande, une exposition ou un projet d'institution.
            Décrivez l'endroit, la saison, le moment. On vous répond depuis
            l'atelier.
          </p>
          <a
            href="mailto:atelier@maisonvasseur.fr"
            className="mt-8 inline-block text-bone underline decoration-line underline-offset-4 transition-colors hover:text-vetiver hover:decoration-vetiver"
          >
            atelier@maisonvasseur.fr
          </a>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          {status === "success" ? (
            <div
              role="status"
              className="flex h-full min-h-[18rem] flex-col items-start justify-center border border-vetiver/40 bg-vetiver-deep/10 p-8"
            >
              <Check size={28} weight="regular" className="text-vetiver" />
              <p className="mt-4 font-display text-2xl tracking-tight text-bone">
                Message reçu.
              </p>
              <p className="mt-2 max-w-[40ch] text-bone-dim">
                Margaux vous répond en général sous quelques jours. Merci de
                votre patience.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-6">
              <div>
                <label htmlFor="nom" className={label}>
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.nom}
                  className={field}
                  placeholder="Votre nom"
                />
                {errors.nom && (
                  <p className="mt-2 text-sm text-vetiver">{errors.nom}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={label}>
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={field}
                  placeholder="vous@exemple.fr"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-vetiver">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className={label}>
                  Le lieu, le moment
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  aria-invalid={!!errors.message}
                  className={`${field} resize-none`}
                  placeholder="Un quai de gare en hiver, une cuisine le dimanche..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-vetiver">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-vetiver px-7 py-3.5 font-medium tracking-tight text-ink transition-colors duration-300 hover:bg-vetiver-deep hover:text-bone active:scale-[0.98] disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <CircleNotch size={18} className="animate-spin" />
                    Envoi
                  </>
                ) : (
                  "Écrire à l'atelier"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
