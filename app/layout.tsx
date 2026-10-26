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
  metadataBase: new URL("https://network.coreviaholdingltd.com"),
  title: "Corevia Rise | COREVIA HOLDINGS LTD",
  description:
    "Corevia Rise by COREVIA HOLDINGS LTD brings together Corevia Rise Network and Corevia Rise Academy. Learn. Connect. Grow.",
  applicationName: "Corevia Rise",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Corevia Rise",
    title: "Corevia Rise | COREVIA HOLDINGS LTD",
    description:
      "Building Trust Through Excellence. Learn, connect and grow with Corevia Rise Network and Corevia Rise Academy.",
    url: "https://network.coreviaholdingltd.com",
    images: [
      {
        url: "/corevia-logo.png",
        width: 609,
        height: 409,
        alt: "COREVIA HOLDINGS LTD official logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corevia Rise | COREVIA HOLDINGS LTD",
    description:
      "The official Corevia Rise platform by COREVIA HOLDINGS LTD.",
    images: ["/corevia-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
