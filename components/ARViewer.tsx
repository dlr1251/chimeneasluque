"use client";

import { useEffect, useState, useRef } from "react";
import { Camera, X, Download, Share2, MapPin } from "lucide-react";

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
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [isCursorBrowser, setIsCursorBrowser] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneInitialized = useRef(false);
  const aframeScriptLoading = useRef(false);
  const arjsScriptLoading = useRef(false);

  // Detectar si estamos en Cursor's browser
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isCursor = userAgent.includes('cursor') || 
                     window.location.hostname.includes('localhost') && 
                     (window as any).__CURSOR__ !== undefined;
    setIsCursorBrowser(isCursor);
  }, []);

  // Cargar scripts manualmente para mayor control
  useEffect(() => {
    // Verificar si A-Frame ya está cargado
    if (typeof window.AFRAME !== "undefined") {
      console.log("✓ A-Frame ya está cargado");
      setAframeReady(true);
      return;
    }

    // Verificar si ya hay un script cargándose o cargado
    const existingScript = document.querySelector('script[src*="aframe.min.js"]');
    if (existingScript || aframeScriptLoading.current) {
      console.log("A-Frame script ya existe o se está cargando, esperando...");
      // Esperar a que se cargue
      const checkInterval = setInterval(() => {
        if (typeof window.AFRAME !== "undefined") {
          clearInterval(checkInterval);
          setAframeReady(true);
        }
      }, 500);
      setTimeout(() => clearInterval(checkInterval), 10000);
      return () => clearInterval(checkInterval);
    }

    aframeScriptLoading.current = true;

    // Cargar A-Frame
    const aframeScript = document.createElement("script");
    aframeScript.src = "https://aframe.io/releases/1.4.2/aframe.min.js";
    aframeScript.async = true;
    aframeScript.id = "aframe-script"; // ID para evitar duplicados
    aframeScript.onload = () => {
      console.log("✓ A-Frame cargado manualmente");
      // Dar tiempo para que A-Frame se inicialice
      setTimeout(() => {
        if (typeof window.AFRAME !== "undefined") {
          setAframeReady(true);
        } else {
          console.warn("A-Frame cargado pero no inicializado, reintentando...");
          setTimeout(() => setAframeReady(true), 500);
        }
      }, 200);
    };
    aframeScript.onerror = () => {
      console.error("Error cargando A-Frame");
      aframeScriptLoading.current = false;
      setError("Error al cargar A-Frame. Verifica tu conexión a internet.");
      setIsLoading(false);
    };
    document.head.appendChild(aframeScript);

    // Verificación periódica por si el onload no se ejecuta
    const checkInterval = setInterval(() => {
      if (typeof window.AFRAME !== "undefined" && !aframeReady) {
        console.log("✓ A-Frame detectado por verificación periódica");
        clearInterval(checkInterval);
        setAframeReady(true);
      }
    }, 500);

    // Limpiar intervalo después de 10 segundos
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [aframeReady]);

  // Cargar AR.js cuando sea necesario (modo marker)
  useEffect(() => {
    if (arMode !== "marker" || arjsReady) return;
    
    // Verificar si AR.js ya está cargado
    if (typeof window.ARjs !== "undefined") {
      console.log("✓ AR.js ya está cargado");
      setArjsReady(true);
      return;
    }

    // Verificar si ya hay un script cargándose o cargado
    const existingScript = document.querySelector('script[src*="aframe-ar.js"]');
    if (existingScript || arjsScriptLoading.current) {
      console.log("AR.js script ya existe o se está cargando, esperando...");
      // Esperar a que se cargue
      const checkInterval = setInterval(() => {
        if (typeof window.ARjs !== "undefined") {
          clearInterval(checkInterval);
          setArjsReady(true);
        }
      }, 500);
      setTimeout(() => clearInterval(checkInterval), 10000);
      return () => clearInterval(checkInterval);
    }

    arjsScriptLoading.current = true;

    // Cargar AR.js
    const arjsScript = document.createElement("script");
    arjsScript.src = "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.0/aframe/build/aframe-ar.js";
    arjsScript.async = true;
    arjsScript.id = "arjs-script"; // ID para evitar duplicados
    arjsScript.onload = () => {
      console.log("✓ AR.js cargado manualmente");
      setArjsReady(true);
    };
    arjsScript.onerror = () => {
      console.warn("Error cargando AR.js desde jsdelivr, intentando alternativo...");
      // Verificar si el fallback ya existe
      const existingFallback = document.querySelector('script[src*="raw.githack.com"][src*="aframe-ar.js"]');
      if (existingFallback) {
        console.log("Fallback script ya existe, esperando...");
        const checkInterval = setInterval(() => {
          if (typeof window.ARjs !== "undefined") {
            clearInterval(checkInterval);
            setArjsReady(true);
          }
        }, 500);
        setTimeout(() => clearInterval(checkInterval), 10000);
        return;
      }
      
      // Intentar CDN alternativo
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://raw.githack.com/AR-js-org/AR.js/3.4.0/aframe/build/aframe-ar.js";
      fallbackScript.async = true;
      fallbackScript.id = "arjs-script-fallback";
      fallbackScript.onload = () => {
        console.log("✓ AR.js cargado desde CDN alternativo");
        setArjsReady(true);
      };
      fallbackScript.onerror = () => {
        console.error("Error al cargar AR.js desde todos los CDNs");
        console.warn("AR.js no disponible, pero continuando sin él...");
        arjsScriptLoading.current = false;
        setArjsReady(true); // Marcar como listo para no bloquear
      };
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(arjsScript);

    return () => {
      // Cleanup
    };
  }, [arMode, arjsReady]);

  // Solicitar permisos de cámara cuando el componente esté listo
  useEffect(() => {
    if (arMode !== "marker" || !arjsReady) return;

    const requestCameraPermission = async () => {
      try {
        // Solicitar permisos de cámara explícitamente
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // Preferir cámara trasera en móviles
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        console.log("✓ Permisos de cámara otorgados");
        // Detener el stream inmediatamente, AR.js lo manejará
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        console.error("Error solicitando permisos de cámara:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraPermissionDenied(true);
          setError("Permiso de cámara denegado. Puedes usar el modo de escritorio o permitir el acceso a la cámara en la configuración del navegador.");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError("No se encontró ninguna cámara en este dispositivo. Cambiando al modo de escritorio...");
          setTimeout(() => {
            setArMode("desktop");
            setShowInstructions(false);
            setError(null);
          }, 2000);
        } else {
          setError("Error al acceder a la cámara. Verifica que el dispositivo tenga una cámara y que esté disponible.");
        }
        setIsLoading(false);
      }
    };

    // Esperar un momento antes de solicitar permisos
    const timeoutId = setTimeout(requestCameraPermission, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [arMode, arjsReady]);

  // Verificar GPS
  useEffect(() => {
    if (navigator.geolocation) {
      setHasGPS(true);
    }
  }, []);

  // Timeout de seguridad global: si después de 12 segundos aún está cargando, mostrar error
  useEffect(() => {
    if (!isLoading) return;
    
    const timeoutId = setTimeout(() => {
      console.error("Timeout global: El módulo AR lleva más de 12 segundos cargando");
      console.log("Estado actual:", {
        aframeReady,
        arjsReady,
        arMode,
        aframeExists: typeof window.AFRAME !== "undefined",
        arjsExists: typeof window.ARjs !== "undefined",
      });
      
      // Si A-Frame está cargado pero no se marcó como ready, forzar
      if (typeof window.AFRAME !== "undefined" && !aframeReady) {
        console.warn("A-Frame está cargado pero no se marcó como ready, forzando...");
        setAframeReady(true);
        setIsLoading(false);
        return;
      }
      
      setError("El módulo AR está tardando demasiado en cargar. Por favor, recarga la página o verifica tu conexión a internet.");
      setIsLoading(false);
    }, 12000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, aframeReady, arjsReady, arMode]);

  // Si no es modo marker, no necesitamos AR.js
  useEffect(() => {
    if (arMode !== "marker" && !arjsReady) {
      setArjsReady(true);
    }
  }, [arMode, arjsReady]);

  // Escuchar cuando la escena A-Frame esté completamente cargada y la cámara esté lista
  useEffect(() => {
    if (!aframeReady || !arjsReady || isLoading || arMode !== "marker") return;

    const checkSceneLoaded = () => {
      const scene = document.querySelector("a-scene") as any;
      if (scene) {
        if (scene.hasLoaded) {
          console.log("✓ Escena A-Frame cargada");
          
          // Esperar a que AR.js inicialice la cámara
          const checkCamera = () => {
            const arSystem = scene.systems["arjs"] || scene.systems["arjs-system"];
            if (arSystem && arSystem._arSource) {
              if (arSystem._arSource.ready) {
                console.log("✓ Cámara AR.js lista");
                
                // Verificar que el video se esté mostrando
                const video = arSystem._arSource.domElement;
                if (video && video.readyState >= 2) {
                  console.log("✓ Video de cámara cargado y listo");
                  // Asegurar que el canvas muestre el video
                  const canvas = scene.canvas;
                  if (canvas) {
                    canvas.style.display = "block";
                    console.log("✓ Canvas visible");
                  }
                  
                  // Añadir listener para detectar cuando el marcador se detecta
                  const marker = document.querySelector("a-marker") as any;
                  if (marker) {
                    marker.addEventListener("markerFound", () => {
                      console.log("✓ Marcador detectado!");
                    });
                    marker.addEventListener("markerLost", () => {
                      console.log("⚠ Marcador perdido");
                    });
                  }
                  
                  setCaptureReady(true);
                } else {
                  console.warn("Video aún no está listo, reintentando...");
                  setTimeout(checkCamera, 500);
                }
              } else {
                // Reintentar después de un momento
                setTimeout(checkCamera, 500);
              }
            } else {
              console.warn("Sistema AR.js no encontrado, reintentando...");
              setTimeout(checkCamera, 500);
            }
          };
          
          // Dar tiempo para que AR.js se inicialice
          setTimeout(checkCamera, 1000);
          
          // Timeout de seguridad
          setTimeout(() => {
            if (!captureReady) {
              console.warn("Timeout esperando cámara, continuando...");
              setCaptureReady(true);
            }
          }, 5000);
        } else {
          const onSceneLoaded = () => {
            console.log("✓ Escena A-Frame cargada (evento)");
            scene.removeEventListener("loaded", onSceneLoaded);
            
            // Esperar a que AR.js inicialice la cámara
            setTimeout(() => {
              const arSystem = scene.systems["arjs"] || scene.systems["arjs-system"];
              if (arSystem && arSystem._arSource && arSystem._arSource.ready) {
                console.log("✓ Cámara AR.js lista");
                const video = arSystem._arSource.domElement;
                if (video && video.readyState >= 2) {
                  console.log("✓ Video de cámara listo");
                }
                
                // Añadir listener para detectar cuando el marcador se detecta
                const marker = document.querySelector("a-marker") as any;
                if (marker) {
                  marker.addEventListener("markerFound", () => {
                    console.log("✓ Marcador detectado!");
                  });
                  marker.addEventListener("markerLost", () => {
                    console.log("⚠ Marcador perdido");
                  });
                }
                
                setCaptureReady(true);
              } else {
                console.warn("Cámara no detectada, pero continuando...");
                setCaptureReady(true);
              }
            }, 2000);
          };
          scene.addEventListener("loaded", onSceneLoaded);
          
          // Timeout de seguridad
          setTimeout(() => {
            scene.removeEventListener("loaded", onSceneLoaded);
            if (!captureReady) {
              console.warn("Timeout esperando carga de escena, continuando...");
              setCaptureReady(true);
            }
          }, 5000);
        }
      } else {
        // Si no hay escena aún, reintentar
        setTimeout(checkSceneLoaded, 500);
      }
    };

    // Esperar un poco para que la escena se renderice
    const timeoutId = setTimeout(checkSceneLoaded, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [aframeReady, arjsReady, isLoading, captureReady, arMode]);

  // Inicializar escena AR después de que A-Frame esté listo
  useEffect(() => {
    // Solo necesitamos A-Frame para empezar. AR.js puede cargar después.
    if (!aframeReady) return;
    
    // Si ya está inicializado, no reinicializar
    if (sceneInitialized.current) return;

    let attempts = 0;
    const maxAttempts = 30; // Máximo 6 segundos (30 * 200ms)
    let timeoutId: NodeJS.Timeout;

    const initializeScene = () => {
      attempts++;
      
      try {
        // Verificar que A-Frame esté completamente cargado
        if (typeof window.AFRAME === "undefined") {
          if (attempts < maxAttempts) {
            timeoutId = setTimeout(initializeScene, 200);
            return;
          } else {
            setError("Error: A-Frame no se cargó correctamente. Verifica tu conexión a internet.");
            setIsLoading(false);
            return;
          }
        }

        // Verificar THREE.js dentro de A-Frame
        if (!window.AFRAME.THREE) {
          if (attempts < maxAttempts) {
            timeoutId = setTimeout(initializeScene, 200);
            return;
          } else {
            setError("Error: A-Frame no se inicializó correctamente. Por favor, recarga la página.");
            setIsLoading(false);
            return;
          }
        }

        console.log("✓ A-Frame listo");

        // Registrar componente de gestos
        if (window.AFRAME && !window.AFRAME.components["gesture-handler"]) {
          window.AFRAME.registerComponent("gesture-handler", {
            init: function () {
              this.scaleFactor = 1;
              const self = this;

              // Escuchar eventos de pellizco
              this.el.addEventListener("pinchstarted", function (evt: any) {
                self.initialScale = self.scaleFactor;
              });

              this.el.addEventListener("pinchmoved", function (evt: any) {
                if (evt.detail && evt.detail.scale) {
                  self.scaleFactor = self.initialScale * evt.detail.scale;
                  const currentScale = self.el.getAttribute("scale") || { x: 0.3, y: 0.3, z: 0.3 };
                  self.el.setAttribute("scale", {
                    x: currentScale.x * self.scaleFactor,
                    y: currentScale.y * self.scaleFactor,
                    z: currentScale.z * self.scaleFactor,
                  });
                }
              });
            },
          });
        }

        // Marcar como inicializado - la escena se renderizará
        sceneInitialized.current = true;
        setIsLoading(false);
        console.log("✅ Escena AR inicializada - renderizando...");
      } catch (err) {
        console.error("Error inicializando escena:", err);
        setError("Error al inicializar la escena AR. Por favor, recarga la página.");
        setIsLoading(false);
      }
    };

    // Iniciar inmediatamente
    initializeScene();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [aframeReady]);

  const handleCapture = () => {
    const scene = document.querySelector("a-scene") as any;
    if (scene && scene.canvas) {
      scene.canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `horno-ar-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    }
  };

  const handleShare = async () => {
    const scene = document.querySelector("a-scene") as any;
    if (scene && scene.canvas && navigator.share) {
      scene.canvas.toBlob(async (blob: Blob | null) => {
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
            handleCapture();
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
          // Reinicializar escena cuando cambiamos de modo
          sceneInitialized.current = false;
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

  const retryCameraPermission = async () => {
    setError(null);
    setCameraPermissionDenied(false);
    setIsLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      console.log("✓ Permisos de cámara otorgados");
      stream.getTracks().forEach(track => track.stop());
      setCameraPermissionDenied(false);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error solicitando permisos de cámara:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermissionDenied(true);
        setError("Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración del navegador y recarga la página.");
      } else {
        setError("Error al acceder a la cámara. Intenta usar el modo de escritorio.");
      }
      setIsLoading(false);
    }
  };

  const switchToDesktop = () => {
    setArMode("desktop");
    setShowInstructions(false);
    setError(null);
    setCameraPermissionDenied(false);
  };

  if (error && !cameraPermissionDenied) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-accent transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (cameraPermissionDenied) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <div className="mb-4">
            <Camera className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-bold mb-2">Permiso de Cámara Requerido</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            {isCursorBrowser && (
              <div className="bg-accent/20 border border-accent/50 rounded-lg p-3 mb-4 text-sm">
                <p className="font-semibold text-accent mb-1">💡 Usando Cursor Browser</p>
                <p className="text-gray-300">
                  Si no puedes otorgar permisos de cámara en Cursor, usa el botón "Usar Modo Escritorio" para ver el modelo 3D sin necesidad de cámara.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4 text-left">
            <p className="font-semibold mb-2">Cómo permitir el acceso a la cámara:</p>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>• <strong>Cursor Browser:</strong> Haz clic en el ícono de candado o cámara en la barra de direcciones → Permisos → Cámara → Permitir. O ve a Cursor Settings → Privacy → Camera y permite el acceso.</li>
              <li>• <strong>Chrome/Edge:</strong> Haz clic en el ícono de cámara en la barra de direcciones y selecciona "Permitir"</li>
              <li>• <strong>Safari:</strong> Ve a Preferencias → Sitios web → Cámara y permite el acceso</li>
              <li>• <strong>Firefox:</strong> Haz clic en el ícono de cámara en la barra de direcciones y selecciona "Permitir"</li>
              <li>• <strong>Móvil:</strong> Ve a Configuración del navegador y permite el acceso a la cámara</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={retryCameraPermission}
              className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-medium"
            >
              Reintentar
            </button>
            <button
              onClick={switchToDesktop}
              className="px-6 py-3 bg-secondary text-primary rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Usar Modo Escritorio
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <li>Coloca el marcador en una superficie plana y bien iluminada</li>
              <li>Apunta la cámara hacia el marcador</li>
              <li>El horno aparecerá superpuesto en AR</li>
              <li>Pellizca la pantalla para hacer zoom</li>
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
          {aframeReady ? (
            arMode === "marker" ? (
              <>
                {!arjsReady && (
                  <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center text-white p-4">
                    <div className="text-center max-w-md">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="mb-2">Cargando AR.js...</p>
                      <p className="text-sm text-gray-300">Esto puede tardar unos segundos</p>
                    </div>
                  </div>
                )}
                <a-scene
                  embedded
                  arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false; detectionMode: mono; cameraParametersUrl: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat; maxDetectionRate: 60; canvasWidth: 640; canvasHeight: 480;"
                  vr-mode-ui="enabled: false"
                  renderer="logarithmicDepthBuffer: true; colorManagement: true; sortObjects: true; antialias: true; alpha: false"
                  id="arjs-video"
                  style={{ width: "100%", height: "100%", opacity: arjsReady ? 1 : 0 }}
                >
                {/* Marcador Hiro */}
                <a-marker
                  preset="hiro"
                  type="pattern"
                  size="1"
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

                  {/* Indicador de instrucciones */}
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
                  light="type: directional; color: #FFF; intensity: 0.8"
                  position="1 1 -1"
                  shadow="cast: true"
                ></a-entity>
                <a-entity 
                  light="type: point; intensity: 0.5; color: #FFA500"
                  position="-1 1 1"
                ></a-entity>
                <a-entity
                  light="type: hemisphere; color: #87CEEB; groundColor: #8B4513; intensity: 0.5"
                ></a-entity>

                {/* No usar a-sky en modo AR, el video de la cámara es el fondo */}
              </a-scene>
              </>
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
                  light="type: directional; color: #FFF; intensity: 0.8"
                  position="1 1 -1"
                ></a-entity>
                <a-entity camera look-controls="enabled: true" wasd-controls="enabled: true"></a-entity>
                <a-sky color="#87CEEB"></a-sky>
              </a-scene>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
