# Chimeneas Luque - Clon Next.js

Este es un clon de la aplicación web de Chimeneas Luque construido con Next.js, TypeScript y Tailwind CSS.

## Características

- ⚡️ Next.js 14 con App Router
- 🎨 Tailwind CSS para estilos
- 📱 Diseño responsive
- 🔍 Navegación suave entre secciones
- 📧 Formulario de contacto integrado
- 🖼️ Optimización de imágenes con Next.js Image
- 📥 Scripts para descargar imágenes del sitio web

## Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Descarga las imágenes del sitio web:

```bash
npm run download-images
```

O si estás en Windows, puedes usar el script PowerShell:

```powershell
.\scripts\download-images.ps1
```

**Nota**: Para más información sobre cómo descargar las imágenes, consulta [README-IMAGES.md](./README-IMAGES.md).

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página principal
│   ├── globals.css     # Estilos globales
│   └── api/
│       └── images/
│           └── route.ts # API route para imágenes
├── components/
│   ├── Header.tsx      # Navegación principal
│   ├── Hero.tsx        # Sección hero
│   ├── Historia.tsx    # Sección historia
│   ├── Disenos.tsx     # Sección diseños especiales
│   ├── Hornos.tsx      # Sección hornos
│   ├── Chimeneas.tsx   # Sección chimeneas
│   ├── Fogatas.tsx     # Sección fogatas
│   └── Contacto.tsx    # Formulario de contacto
├── public/
│   └── images/
│       ├── hornos/     # Imágenes de hornos
│       ├── chimeneas/  # Imágenes de chimeneas
│       └── fogatas/    # Imágenes de fogatas
├── scripts/
│   ├── fetch-images.js          # Script Node.js para descargar imágenes
│   ├── download-images.ps1      # Script PowerShell para descargar imágenes
│   └── manual-download.md       # Guía para descarga manual
└── package.json
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run download-images` - Descarga imágenes del sitio web

## Descarga de Imágenes

Para descargar las imágenes del sitio web de Chimeneas Luque, tienes varias opciones:

1. **Script Automático (Node.js)**: Ejecuta `npm run download-images`
2. **Script PowerShell (Windows)**: Ejecuta `.\scripts\download-images.ps1`
3. **Descarga Manual**: Sigue las instrucciones en [README-IMAGES.md](./README-IMAGES.md)

Las imágenes deben guardarse en:
- `public/images/hornos/` - Hornos (horno1.jpg, horno2.jpg, ..., horno14.jpg)
- `public/images/chimeneas/` - Chimeneas (chimenea1.jpg, chimenea2.jpg, ..., chimenea32.jpg)
- `public/images/fogatas/` - Fogatas (fogata1.jpg, fogata2.jpg, ..., fogata14.jpg)

## Notas

- Las imágenes se optimizan automáticamente usando Next.js Image component.
- Si las imágenes no se descargan automáticamente, puedes descargarlas manualmente siguiendo las instrucciones en [README-IMAGES.md](./README-IMAGES.md).
- El formulario de contacto actualmente abre el cliente de correo predeterminado. Puedes integrarlo con un servicio de backend si lo deseas.
- Las imágenes que no existen mostrarán un placeholder automáticamente hasta que se descarguen.

