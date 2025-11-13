"use client";

import { useEffect, useState, useRef } from "react";
import { Camera, X, Download, Share2, MapPin, Maximize2, RotateCw } from "lucide-react";

declare global {
  interface Window {
    AFRAME: any;
    ARjs: any;
  }
}

interface ARViewerProps {
  onClose?: () => void;
}

export default function ARViewer({ onClose }: ARViewerProps) {
  const [arMode, setArMode] = useState<"marker" | "gps" | "desktop">("marker");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasGPS, setHasGPS] = useState(false);
  const [captureReady, setCaptureReady] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const scriptsLoaded = useRef(false);

  // Cargar scripts de A-Frame y AR.js
  useEffect(() => {
    if (scriptsLoaded.current) return;

    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadAR = async () => {
      try {
        setIsLoading(true);
        await loadScript(
          "https://aframe.io/releases/1.5.0/aframe.min.js",
          "aframe-script"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.5.0/aframe/build/aframe-ar-nft.js",
          "arjs-script"
        );
        scriptsLoaded.current = true;
        setIsLoading(false);
      } catch (err) {
        setError("Error al cargar AR.js. Asegúrate de estar conectado a internet.");
        setIsLoading(false);
      }
    };

    loadAR();

    // Verificar GPS
    if (navigator.geolocation) {
      setHasGPS(true);
    }
  }, []);

  // Inicializar escena AR después de cargar scripts
  useEffect(() => {
    if (isLoading || error || !scriptsLoaded.current || !sceneRef.current) return;

    // Verificar si A-Frame está disponible
    if (typeof window.AFRAME === "undefined") {
      setError("A-Frame no está disponible");
      return;
    }

    const timeout = setTimeout(() => {
      setCaptureReady(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isLoading, error]);

  const handleCapture = () => {
    const scene = document.querySelector("a-scene") as any;
    const canvas = scene?.canvas as HTMLCanvasElement | null;
    if (canvas) {
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `horno-ar-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    }
  };

  const handleShare = async () => {
    const scene = document.querySelector("a-scene") as any;
    const canvas = scene?.canvas as HTMLCanvasElement | null;
    if (canvas && navigator.share) {
      canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], "horno-ar.png", { type: "image/png" });
          try {
            await navigator.share({
              files: [file],
              title: "Horno de Leña en AR - Chimeneas Luque",
              text: "Mira este horno de leña en realidad aumentada!",
            });
          } catch (err) {
            console.error("Error compartiendo:", err);
          }
        }
      }, "image/png");
    } else {
      handleCapture();
    }
  };

  const downloadMarker = () => {
    window.open(
      "https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg",
      "_blank"
    );
  };

  const switchToGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setArMode("gps");
          setShowInstructions(false);
        },
        (err) => {
          alert("Error al obtener ubicación GPS. Usa el modo con marcador.");
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando módulo AR...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-accent transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header de controles */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 backdrop-blur-sm text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span className="font-semibold">Vista AR</span>
          </div>
          <div className="flex items-center space-x-2">
            {captureReady && (
              <>
                <button
                  onClick={handleCapture}
                  className="p-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                  title="Capturar"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                  title="Compartir"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      {showInstructions && (
        <div className="absolute top-20 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm text-white p-6 mx-4 rounded-lg">
          <button
            onClick={() => setShowInstructions(false)}
            className="absolute top-2 right-2 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-lg mb-3">Instrucciones para AR</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
            <li>Imprime el marcador Hiro desde el botón abajo</li>
            <li>Coloca el marcador en una superficie plana</li>
            <li>Apunta la cámara hacia el marcador</li>
            <li>El horno aparecerá superpuesto en AR</li>
          </ol>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={downloadMarker}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition-colors text-sm flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Marcador</span>
            </button>
            {hasGPS && (
              <button
                onClick={switchToGPS}
                className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-gray-300 transition-colors text-sm flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Modo GPS (sin marcador)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Escena AR */}
      <div ref={sceneRef} className="w-full h-full">
        {arMode === "marker" ? (
          <a-scene
            embedded
            arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; colorManagement: true; sortObjects: true"
            gesture-detector
            id="arjs-video"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Marcador Hiro */}
            <a-marker
              preset="hiro"
              type="pattern"
              raycaster="objects: .interactive"
              emitevents="true"
              cursor="fuse: false; rayOrigin: mouse"
            >
              {/* Modelo 3D del Horno */}
              <a-entity
                id="oven-model"
                gltf-model="url(/models/horno-leña.glb)"
                position="0 0 0"
                scale="0.3 0.3 0.3"
                rotation="0 180 0"
                animation__rotate="property: rotation; to: 0 540 0; loop: true; dur: 20000; easing: linear"
                class="interactive"
                gesture-handler
              >
                {/* Animación de humo */}
                <a-entity
                  position="0 1 0"
                  particle-system="preset: default; particleCount: 50; color: #CCCCCC; maxAge: 3; velocityValue: 0.02 0.1 0"
                ></a-entity>
              </a-entity>

              {/* Indicador de rotación */}
              <a-entity
                text="value: Pellizca para zoom; align: center; width: 5"
                position="0 -0.5 0"
                look-at="[camera]"
              ></a-entity>
            </a-marker>

            {/* Cámara */}
            <a-entity camera look-controls="enabled: false" wasd-controls="enabled: false"></a-entity>

            {/* Iluminación realista */}
            <a-entity light="type: ambient; color: #FFF; intensity: 0.6"></a-entity>
            <a-entity
              light="type: directional; color: #FFF; intensity: 0.8; position: 1 1 -1"
              shadow="cast: true"
            ></a-entity>
            <a-entity light="type: point; intensity: 0.5; position: -1 1 1; color: #FFA500"></a-entity>
            <a-entity
              light="type: hemisphere; color: #87CEEB; groundColor: #8B4513; intensity: 0.5"
            ></a-entity>

            {/* Cielo/background */}
            <a-sky color="#87CEEB"></a-sky>
          </a-scene>
        ) : (
          <a-scene
            embedded
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true"
            style={{ width: "100%", height: "100%" }}
          >
            <a-entity
              gltf-model="url(/models/horno-leña.glb)"
              position="0 0 -2"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
              animation__rotate="property: rotation; to: 0 360 0; loop: true; dur: 20000"
            ></a-entity>
            <a-entity light="type: ambient; color: #FFF; intensity: 0.6"></a-entity>
            <a-entity
              light="type: directional; color: #FFF; intensity: 0.8; position: 1 1 -1"
            ></a-entity>
            <a-entity camera look-controls="enabled: true" wasd-controls="enabled: true"></a-entity>
            <a-sky color="#87CEEB"></a-sky>
          </a-scene>
        )}
      </div>

      {/* Scripts para gestos e interactividad */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Componente para gestos de pellizco (pinch-to-zoom)
            if (typeof window.AFRAME !== 'undefined') {
              window.AFRAME.registerComponent('gesture-handler', {
                init: function () {
                  this.scaleFactor = 1;
                  this.el.addEventListener('pinchstarted', (evt) => {
                    this.initialScale = this.scaleFactor;
                  });
                  this.el.addEventListener('pinchmoved', (evt) => {
                    this.scaleFactor = this.initialScale * evt.detail.scale;
                    this.el.setAttribute('scale', {
                      x: 0.3 * this.scaleFactor,
                      y: 0.3 * this.scaleFactor,
                      z: 0.3 * this.scaleFactor
                    });
                  });
                }
              });

              // Detectar cuando el marcador es visible
              const marker = document.querySelector('a-marker');
              if (marker) {
                marker.addEventListener('markerFound', () => {
                  console.log('Marcador detectado');
                });
                marker.addEventListener('markerLost', () => {
                  console.log('Marcador perdido');
                });
              }
            }
          `,
        }}
      />
    </div>
  );
}

