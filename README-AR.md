# Módulo de Realidad Aumentada (AR)

Este proyecto incluye un módulo completo de Realidad Aumentada para visualizar el horno de leña en 3D usando la cámara del dispositivo.

## 🚀 Características

- ✅ **AR con Marcador Hiro**: Visualización AR usando el marcador estándar
- ✅ **Modo GPS**: Visualización sin marcador usando geolocalización (si está disponible)
- ✅ **Vista 3D Desktop**: Fallback para dispositivos sin cámara
- ✅ **Gestos Interactivos**: Pellizca para zoom, arrastra para rotar
- ✅ **Captura y Compartir**: Captura pantalla y comparte la experiencia
- ✅ **Animación de Humo**: Partículas de humo animadas saliendo del horno
- ✅ **Iluminación Realista**: Múltiples fuentes de luz para resaltar texturas
- ✅ **Responsive**: Funciona en móviles y tablets

## 📋 Requisitos

- Navegador con soporte WebRTC (Chrome, Firefox, Safari en iOS 11+)
- Cámara del dispositivo (para modo AR)
- Conexión a internet (para cargar A-Frame y AR.js)

## 🎯 Uso

### Opción 1: Desde el Menú

1. Haz clic en el botón **"AR"** en el menú principal
2. Permite el acceso a la cámara cuando se solicite
3. Sigue las instrucciones en pantalla

### Opción 2: URL Directa

Visita: `https://tu-dominio.com/ar`

## 📱 Instrucciones Paso a Paso

### Modo con Marcador (Recomendado)

1. **Descargar Marcador**: Haz clic en "Descargar Marcador" en las instrucciones
2. **Imprimir**: Imprime el marcador Hiro en una hoja tamaño carta
3. **Colocar**: Coloca el marcador en una superficie plana y bien iluminada
4. **Apuntar**: Apunta la cámara del dispositivo hacia el marcador
5. **Visualizar**: El horno aparecerá superpuesto en AR

### Modo GPS (Sin Marcador)

1. Haz clic en "Modo GPS (sin marcador)"
2. Permite el acceso a la ubicación GPS
3. El horno aparecerá en una vista 3D interactiva

### Controles

- **Pellizca**: Zoom in/out del modelo
- **Arrastra**: Rotar el modelo
- **Capturar**: Botón de descarga para guardar captura
- **Compartir**: Compartir la captura (si está disponible en el dispositivo)

## 🔧 Componentes Técnicos

### Tecnologías Utilizadas

- **A-Frame**: Framework WebXR para crear experiencias 3D/AR
- **AR.js**: Librería AR para web usando marcadores
- **Next.js**: Framework React con App Router
- **TypeScript**: Tipado estático

### Estructura de Archivos

```
components/
  └── ARViewer.tsx      # Componente principal AR
app/
  └── ar/
      ├── page.tsx      # Página AR
      └── layout.tsx    # Layout de la página AR
public/
  └── models/
      └── horno-leña.glb  # Modelo 3D del horno
```

## 🎨 Personalización

### Ajustar Escala del Modelo

En `components/ARViewer.tsx`, busca:

```tsx
scale="0.3 0.3 0.3"  // Modifica estos valores
```

### Cambiar Velocidad de Rotación

```tsx
animation__rotate="property: rotation; to: 0 540 0; loop: true; dur: 20000"
// Cambia 'dur: 20000' (20 segundos) a otro valor
```

### Modificar Partículas de Humo

```tsx
particle-system="preset: default; particleCount: 50; color: #CCCCCC; maxAge: 3"
// Ajusta 'particleCount', 'color', 'maxAge' según necesites
```

## 🌐 Compatibilidad

### Navegadores Soportados

| Navegador | AR con Marcador | GPS | Vista 3D |
|-----------|----------------|-----|----------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ❌ | ❌ | ✅ |
| Safari (iOS 11+) | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |

### Dispositivos

- **Móviles**: iOS 11+, Android 8+
- **Tablets**: Compatibles
- **Desktop**: Solo vista 3D (sin AR)

## 🐛 Solución de Problemas

### La cámara no se activa

1. Verifica que has dado permisos de cámara al navegador
2. Asegúrate de estar usando HTTPS (requerido para WebRTC)
3. Intenta en un navegador diferente

### El modelo no aparece

1. Verifica que el archivo `horno-leña.glb` existe en `public/models/`
2. Abre la consola del navegador (F12) para ver errores
3. Verifica la conexión a internet (A-Frame se carga desde CDN)

### El marcador no se detecta

1. Asegúrate de tener buena iluminación
2. El marcador debe estar plano y visible completamente
3. Mantén el dispositivo a 30-50 cm del marcador
4. Evita reflejos o sombras sobre el marcador

### Problemas de rendimiento

1. Cierra otras aplicaciones que usen la cámara
2. Reduce la calidad de la cámara en la configuración del navegador
3. Usa un dispositivo con más RAM si es posible

## 📸 Capturas

### Tomar Captura

1. Haz clic en el botón de descarga (📥) en la barra superior
2. La imagen se descargará automáticamente

### Compartir

1. Haz clic en el botón de compartir (📤)
2. Si tu dispositivo soporta Web Share API, se abrirá el menú de compartir
3. Si no, se descargará la imagen automáticamente

## 🔐 Privacidad

- **Cámara**: Solo se usa para AR en tiempo real, no se guarda video
- **GPS**: Solo se usa en modo GPS, opcional
- **Datos**: No se envían datos a servidores externos (excepto CDN de A-Frame)

## 🚀 Despliegue

### Vercel

El módulo AR está listo para desplegarse en Vercel. Asegúrate de:

1. El archivo `horno-leña.glb` esté en `public/models/`
2. Los headers de CSP estén configurados (ya incluidos en `next.config.js`)
3. El sitio esté en HTTPS (requerido para WebRTC)

### Variables de Entorno

No se requieren variables de entorno adicionales.

## 📚 Recursos

- [A-Frame Documentation](https://aframe.io/docs/)
- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- [WebXR Specifications](https://www.w3.org/TR/webxr/)
- [Marcador Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg)

## 🤝 Contribuir

Si encuentras problemas o quieres mejorar el módulo AR:

1. Abre un issue en GitHub
2. Describe el problema o la mejora
3. Incluye screenshots si es posible

## 📝 Notas

- El modelo 3D (`horno-leña.glb`) es de aproximadamente 13MB, asegúrate de tener buena conexión
- En dispositivos antiguos, la experiencia puede ser más lenta
- Para mejor experiencia, usa el modo AR en lugar de vista 3D desktop


