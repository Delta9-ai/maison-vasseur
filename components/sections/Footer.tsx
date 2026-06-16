import {
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

const reseaux = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
  { label: "TikTok", href: "https://tiktok.com", Icon: TiktokLogo },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeLogo },
];

export function Footer() {
  return (
    <footer className="border-t border-line py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl font-medium tracking-tight text-bone">
              Maison Vasseur
            </p>
            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-bone-dim">
              Atelier olfactif, rue Sainte, 13007 Marseille. Sur rendez-vous.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {reseaux.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${label} de la Maison Vasseur`}
                className="inline-flex w-fit items-center gap-2 text-sm text-bone-dim transition-colors hover:text-vetiver"
              >
                <Icon size={18} weight="regular" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-sm text-bone-faint sm:flex-row sm:justify-between">
          <p>Margaux Vasseur, artiste olfactive.</p>
          <p>2026, tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
