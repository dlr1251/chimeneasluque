# Guía para Descargar Imágenes

Este documento explica cómo descargar las imágenes del sitio web de Chimeneas Luque.

## Método 1: Script Automático (Node.js)

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Ejecutar el script

```bash
npm run download-images
```

Este script intentará descargar las imágenes automáticamente desde el sitio web.

## Método 2: Script PowerShell (Windows)

Si estás en Windows, puedes usar el script PowerShell:

```powershell
.\scripts\download-images.ps1
```

**Nota**: Puede que necesites cambiar la política de ejecución de PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Método 3: Descarga Manual

Si los scripts automáticos no funcionan, puedes descargar las imágenes manualmente:

### Opción A: Usando el Navegador

1. Visita https://www.chimeneasluque.com
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Network** (Red)
4. Filtra por **Img** (Imágenes)
5. Navega por las secciones del sitio (Hornos, Chimeneas, Fogatas)
6. Para cada imagen:
   - Haz clic derecho en la imagen en la lista de Network
   - Selecciona "Open in new tab" (Abrir en nueva pestaña)
   - Guarda la imagen con el nombre apropiado:
     - Hornos: `horno1.jpg`, `horno2.jpg`, etc. (hasta 14)
     - Chimeneas: `chimenea1.jpg`, `chimenea2.jpg`, etc. (hasta 32)
     - Fogatas: `fogata1.jpg`, `fogata2.jpg`, etc. (hasta 14)
   - Coloca las imágenes en las carpetas correspondientes:
     - `public/images/hornos/`
     - `public/images/chimeneas/`
     - `public/images/fogatas/`

### Opción B: Usando wget (si está instalado)

```bash
# Descargar imágenes de hornos
wget -r -l 1 -H -t 1 -nd -N -np -A.jpg,.jpeg,.png -erobots=off -P public/images/hornos https://www.chimeneasluque.com/hornos

# Descargar imágenes de chimeneas
wget -r -l 1 -H -t 1 -nd -N -np -A.jpg,.jpeg,.png -erobots=off -P public/images/chimeneas https://www.chimeneasluque.com/chimeneas

# Descargar imágenes de fogatas
wget -r -l 1 -H -t 1 -nd -N -np -A.jpg,.jpeg,.png -erobots=off -P public/images/fogatas https://www.chimeneasluque.com/fogatas
```

## Estructura de Carpetas

Las imágenes deben estar organizadas de la siguiente manera:

```
public/
  images/
    hornos/
      horno1.jpg
      horno2.jpg
      ...
      horno14.jpg
    chimeneas/
      chimenea1.jpg
      chimenea2.jpg
      ...
      chimenea32.jpg
    fogatas/
      fogata1.jpg
      fogata2.jpg
      ...
      fogata14.jpg
```

## Nombres de Archivos

Asegúrate de nombrar las imágenes según estos patrones:

- **Hornos**: `horno1.jpg`, `horno2.jpg`, ..., `horno14.jpg`
- **Chimeneas**: `chimenea1.jpg`, `chimenea2.jpg`, ..., `chimenea32.jpg`
- **Fogatas**: `fogata1.jpg`, `fogata2.jpg`, ..., `fogata14.jpg`

## Formatos Soportados

Las imágenes pueden estar en cualquiera de estos formatos:
- JPG / JPEG
- PNG
- WebP
- GIF

## Verificación

Después de descargar las imágenes, verifica que estén en las carpetas correctas:

```bash
# Windows PowerShell
Get-ChildItem -Recurse public\images | Measure-Object

# Linux/Mac
find public/images -type f | wc -l
```

## Notas Importantes

1. **Derechos de Autor**: Asegúrate de tener los derechos o permisos necesarios para usar las imágenes, especialmente si el proyecto es con fines comerciales.

2. **Optimización**: Las imágenes se optimizan automáticamente usando Next.js Image component, pero puedes optimizarlas manualmente antes de agregarlas usando herramientas como:
   - [TinyPNG](https://tinypng.com/)
   - [ImageOptim](https://imageoptim.com/)
   - [Squoosh](https://squoosh.app/)

3. **Placeholders**: Si las imágenes no se descargan, la aplicación mostrará placeholders automáticamente hasta que las imágenes estén disponibles.

## Solución de Problemas

### Las imágenes no se descargan

1. Verifica tu conexión a internet
2. Verifica que el sitio web esté accesible
3. Inspecciona el sitio web para encontrar las URLs reales de las imágenes
4. Actualiza los scripts con las URLs correctas
5. Descarga las imágenes manualmente siguiendo el Método 3

### Las imágenes no se muestran en la aplicación

1. Verifica que las imágenes estén en las carpetas correctas
2. Verifica que los nombres de archivo sigan el patrón correcto
3. Verifica que las imágenes sean válidas (abre una imagen para verificar)
4. Limpia la caché de Next.js: `rm -rf .next` (o `Remove-Item -Recurse -Force .next` en PowerShell)
5. Reinicia el servidor de desarrollo

### Error de permisos (PowerShell)

Si recibes un error de permisos al ejecutar el script PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego intenta ejecutar el script nuevamente.

