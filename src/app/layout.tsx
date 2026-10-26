import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wedding of Riyan & Intan | Undangan Pernikahan Digital",
  description:
    "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada momen bahagia pernikahan kami.",
  keywords: ["undangan pernikahan digital", "wedding invitation", "riyan perdhanaputra", "intan nuraini", "katsudoto"],
  openGraph: {
    title: "The Wedding of Riyan & Intan",
    description: "Undangan Pernikahan Eksklusif & Modern",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${jakarta.variable} ${greatVibes.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased bg-[#FAF7F2] text-stone-800 selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
