"use client";

import { Suspense } from "react";
import ARViewer from "@/components/ARViewer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ARPage() {
  return (
    <div className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando módulo AR...</p>
            </div>
          </div>
        }
      >
        <ARViewer
          onClose={() => {
            window.location.href = "/";
          }}
        />
      </Suspense>
      
      {/* Botón de regreso */}
      <Link
        href="/"
        className="absolute bottom-4 left-4 z-20 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </Link>
    </div>
  );
}


