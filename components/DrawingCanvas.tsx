"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Trash2, Pencil, Minus, Square, Circle, Eraser } from "lucide-react";

type DrawingTool = "pencil" | "line" | "rectangle" | "circle" | "eraser";

interface Point {
  x: number;
  y: number;
}

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("pencil");
  const [currentColor, setCurrentColor] = useState<string>("#1a1a1a");
  const [brushSize, setBrushSize] = useState<number>(2);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [savedImage, setSavedImage] = useState<ImageData | null>(null);

  // Colores disponibles siguiendo el esquema del proyecto
  const colors = [
    { name: "Negro", value: "#1a1a1a" }, // primary
    { name: "Gris Claro", value: "#f5f5f5" }, // secondary
    { name: "Beige", value: "#d4a574" }, // accent
    { name: "Gris Oscuro", value: "#4a4a4a" },
    { name: "Gris Medio", value: "#8a8a8a" },
    { name: "Gris Claro 2", value: "#c0c0c0" },
    { name: "Blanco", value: "#ffffff" },
  ];

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar tamaño del canvas al contenedor
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const newWidth = container.clientWidth;
        const newHeight = Math.min(600, newWidth * 0.75);
        
        // Guardar imagen actual antes de redimensionar
        let currentImage: ImageData | null = null;
        if (canvas.width > 0 && canvas.height > 0) {
          currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Limpiar con fondo blanco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Restaurar imagen si existe (aunque las dimensiones pueden no coincidir exactamente)
        if (currentImage && savedImage) {
          try {
            ctx.putImageData(savedImage, 0, 0);
          } catch (e) {
            // Si las dimensiones no coinciden, simplemente dejamos el canvas limpio
          }
        } else if (savedImage) {
          try {
            ctx.putImageData(savedImage, 0, 0);
          } catch (e) {
            // Si las dimensiones no coinciden, simplemente dejamos el canvas limpio
          }
        }
      }
    };

    // Inicializar una vez
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = Math.min(600, container.clientWidth * 0.75);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Actualizar canvas cuando cambia savedImage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !savedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      ctx.putImageData(savedImage, 0, 0);
    } catch (e) {
      // Si las dimensiones no coinciden, ignoramos el error
    }
  }, [savedImage]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);
    setIsDrawing(true);
    setStartPoint(point);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Guardar el estado actual del canvas
    setSavedImage(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (currentTool === "pencil" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || !startPoint) return;

    const currentPoint = getCoordinates(e);

    // Restaurar imagen guardada
    if (savedImage) {
      ctx.putImageData(savedImage, 0, 0);
    }

    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (currentTool === "pencil" || currentTool === "eraser") {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (currentTool === "line") {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (currentTool === "rectangle") {
      ctx.strokeRect(
        startPoint.x,
        startPoint.y,
        currentPoint.x - startPoint.x,
        currentPoint.y - startPoint.y
      );
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.x, 2) +
        Math.pow(currentPoint.y - startPoint.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Guardar el estado final
    setSavedImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
    setIsDrawing(false);
    setStartPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSavedImage(null);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `dibujo-tecnico-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const tools = [
    { id: "pencil" as DrawingTool, icon: Pencil, label: "Lápiz" },
    { id: "line" as DrawingTool, icon: Minus, label: "Línea" },
    { id: "rectangle" as DrawingTool, icon: Square, label: "Rectángulo" },
    { id: "circle" as DrawingTool, icon: Circle, label: "Círculo" },
    { id: "eraser" as DrawingTool, icon: Eraser, label: "Borrador" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Barra de herramientas */}
      <div className="bg-white rounded-lg border border-gray-300 p-4 space-y-4">
        {/* Herramientas */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Herramientas:
          </label>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setCurrentTool(tool.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                    currentTool === tool.id
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-primary border-gray-300 hover:border-primary hover:bg-gray-50"
                  }`}
                  title={tool.label}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline text-sm">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colores */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Color:
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setCurrentColor(color.value)}
                className={`w-10 h-10 rounded-md border-2 transition-all ${
                  currentColor === color.value
                    ? "border-primary scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Tamaño del pincel */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Grosor: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-primary rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
          >
            <Trash2 size={18} />
            <span className="text-sm">Limpiar</span>
          </button>
          <button
            type="button"
            onClick={exportImage}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition-colors"
          >
            <Download size={18} />
            <span className="text-sm">Exportar Imagen</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full border border-gray-200 rounded-md cursor-crosshair touch-none"
          style={{ maxHeight: "600px" }}
        />
      </div>
    </div>
  );
}

