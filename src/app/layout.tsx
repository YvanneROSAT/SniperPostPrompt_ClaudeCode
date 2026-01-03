import type { Metadata } from "next";
import Script from "next/script";
import {
  Geist,
  Geist_Mono,
  Inter,
  Roboto,
  Open_Sans,
  Montserrat,
  Poppins,
  Lato,
  Playfair_Display,
  Merriweather,
  Raleway,
  Nunito,
  Source_Sans_3,
  Ubuntu,
  Oswald,
  Quicksand,
  Fira_Code
} from "next/font/google";
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

// 15 polices populaires Google Fonts
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", weight: ["400", "700"], subsets: ["latin"] });
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", weight: ["400", "600", "700"], subsets: ["latin"] });
const lato = Lato({ variable: "--font-lato", weight: ["400", "700"], subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-merriweather", weight: ["400", "700"], subsets: ["latin"] });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"] });
const ubuntu = Ubuntu({ variable: "--font-ubuntu", weight: ["400", "700"], subsets: ["latin"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"] });
const quicksand = Quicksand({ variable: "--font-quicksand", subsets: ["latin"] });
const firaCode = Fira_Code({ variable: "--font-fira-code", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Styler - Creez des prompts stylises",
  description: "Creez et exportez des prompts stylises pour vos reseaux sociaux et presentations. Personnalisez les polices, couleurs et formats d'export.",
  keywords: ["prompt", "styler", "social media", "design", "export", "image"],
  authors: [{ name: "Prompt Styler" }],
  icons: {
    icon: "/favicon.svg",
  },
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
      <head>
        {/* Google AdSense - lazyOnload pour ne pas interférer avec le layout initial */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${lato.variable} ${playfairDisplay.variable} ${merriweather.variable} ${raleway.variable} ${nunito.variable} ${sourceSans.variable} ${ubuntu.variable} ${oswald.variable} ${quicksand.variable} ${firaCode.variable} antialiased`}
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
