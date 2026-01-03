import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prompt Styler - Créez des prompts stylisés",
  description: "Créez et exportez des prompts stylisés pour vos réseaux sociaux et présentations. Personnalisez les polices, couleurs et formats d'export.",
  keywords: ["prompt", "styler", "social media", "design", "export", "image"],
  authors: [{ name: "Prompt Styler" }],
  openGraph: {
    title: "Prompt Styler - Créez des prompts stylisés",
    description: "Créez et exportez des prompts stylisés pour vos réseaux sociaux et présentations.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Styler",
    description: "Créez et exportez des prompts stylisés",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
