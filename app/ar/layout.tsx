import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vista AR - Horno de Leña | Chimeneas Luque",
  description: "Visualiza nuestro horno de leña en realidad aumentada usando tu cámara",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ARLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


