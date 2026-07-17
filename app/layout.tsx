import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLS Firefighter Background Investigations",
  description:
    "Firefighter background investigations and fire department background check support for public-safety hiring leaders.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CLS Firefighter Background Investigations",
    description:
      "Firefighter background investigations, firefighter background checks, and EMS candidate screening support from CLS.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1680,
        height: 945,
        alt: "Fire department hiring leader reviewing background investigation files",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLS Firefighter Background Investigations",
    description:
      "Firefighter background investigations, firefighter background checks, and EMS candidate screening support from CLS.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
