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
  title: "COREVIA HOLDINGS LTD | Corevia Network",
  description:
    "The official Corevia Network platform by COREVIA HOLDINGS LTD. Explore digital learning, member networking, and opportunities.",
  applicationName: "Corevia Network",
  openGraph: {
    type: "website",
    siteName: "COREVIA HOLDINGS LTD",
    title: "COREVIA HOLDINGS LTD | Corevia Network",
    description:
      "Building Trust Through Excellence. Explore Corevia Network, digital learning, member networking, and opportunities.",
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
    title: "COREVIA HOLDINGS LTD | Corevia Network",
    description:
      "The official Corevia Network platform by COREVIA HOLDINGS LTD.",
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

