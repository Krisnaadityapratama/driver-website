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
  metadataBase: new URL("https://posnusa.vercel.app"),

  title: {
    default: "POSNusa by VELNEXA",
    template: "%s | POSNusa",
  },

  description:
    "POSNusa by VELNEXA adalah pusat download driver printer thermal, scanner barcode, software kasir, tutorial instalasi, dan solusi perangkat POS retail terlengkap di Indonesia.",

  keywords: [
    "driver printer thermal",
    "software kasir",
    "barcode scanner",
    "driver barcode",
    "download driver printer",
    "printer thermal",
    "POS Indonesia",
    "POSNusa",
    "VELNEXA",
    "tutorial printer thermal",
    "driver seagull",
    "driver barcode scanner",
    "software retail",
    "tutorial install printer",
    "thermal printer driver",
    "kasir digital",
    "retail technology",
    "IoT Indonesia",
  ],

  authors: [
    {
      name: "VELNEXA",
      url: "https://posnusa.vercel.app",
    },
  ],

  creator: "VELNEXA",
  publisher: "VELNEXA",

  applicationName: "POSNusa",

  category: "technology",

  alternates: {
    canonical: "https://posnusa.vercel.app",
  },

  openGraph: {
    title: "POSNusa by VELNEXA",
    description:
      "Download driver printer thermal, barcode scanner, software kasir, dan tutorial perangkat POS retail terlengkap.",
    url: "https://posnusa.vercel.app",
    siteName: "POSNusa",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "POSNusa by VELNEXA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "POSNusa by VELNEXA",
    description:
      "Pusat driver printer thermal, scanner barcode, software kasir, dan tutorial perangkat retail.",
    images: ["/icon.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  verification: {
    google: "google-site-verification-code",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}