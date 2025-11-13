import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chimeneas Luque - Chimeneas y Hornos de Leña",
  description: "Fabricantes de chimeneas y hornos de leña desde 1975. Tradición artesanal en concreto, ladrillo refractario y hierro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

