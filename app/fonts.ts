import localFont from "next/font/local";

export const display = localFont({
  src: "../public/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--ff-display",
  weight: "100 900",
  display: "swap",
});

export const body = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.woff2",
      style: "normal",
      weight: "200 700",
    },
    {
      path: "../public/fonts/GeneralSans-VariableItalic.woff2",
      style: "italic",
      weight: "200 700",
    },
  ],
  variable: "--ff-body",
  display: "swap",
});
