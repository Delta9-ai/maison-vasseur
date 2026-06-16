import type { Metadata } from "next";
import { display, body } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Vasseur, parfums comme portraits de lieux",
  description:
    "Margaux Vasseur, artiste olfactive. Des parfums composés comme des œuvres, portraits de lieux et de moments. Atelier à Marseille.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ink text-bone font-body">
        {children}
      </body>
    </html>
  );
}
