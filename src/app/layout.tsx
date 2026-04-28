import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donaciones CEII - Centro de Estudiantes de Ingeniería en Informática",
  description:
    "Apoya al Centro de Estudiantes de Ingeniería en Informática (CEII) para equipar la sede con internet Starlink e infraestructura de red para los estudiantes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
