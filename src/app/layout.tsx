import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
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
  title: "Prompt Styler - Creez des prompts stylises",
  description: "Creez et exportez des prompts stylises pour vos reseaux sociaux et presentations. Personnalisez les polices, couleurs et formats d'export.",
  keywords: ["prompt", "styler", "social media", "design", "export", "image"],
  authors: [{ name: "Prompt Styler" }],
  openGraph: {
    title: "Prompt Styler - Creez des prompts stylises",
    description: "Creez et exportez des prompts stylises pour vos reseaux sociaux et presentations.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Styler",
    description: "Creez et exportez des prompts stylises",
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
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
