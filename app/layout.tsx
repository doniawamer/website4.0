import type { Metadata } from "next";
import { Homemade_Apple, Newsreader, IBM_Plex_Mono } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { buildAllThemeVars, themeInitScriptSource } from "@/lib/theme";
import "@/styles/globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://doniawamer.com";

const homemadeApple = Homemade_Apple({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const themeInitScript = themeInitScriptSource(JSON.stringify(buildAllThemeVars()));

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "donia amer",
    template: "%s | donia amer",
  },
  description:
    "I'm a design oriented software engineer that focuses on building immersive and accessible digital experiences.",
  applicationName: "Donia Amer",
  authors: [{ name: "Donia Amer", url: SITE }],
  creator: "Donia Amer",
  keywords: [
    "Donia Amer",
    "Senior Front-End Engineer",
    "React",
    "TypeScript",
    "Remix",
    "Toronto",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [{ url: "/llms.txt", title: "llms.txt" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE,
    siteName: "Donia Amer",
    title: "Donia Amer — Senior Front-End Engineer",
    description:
      "I build (and occasionally design) things for the web. Design-oriented front-end engineering in Toronto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donia Amer — Senior Front-End Engineer",
    description:
      "I build (and occasionally design) things for the web. Design-oriented front-end engineering in Toronto.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${homemadeApple.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="author" href="/llms.txt" />
      </head>
      <body suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
