# Guía para Descargar Imágenes Manualmente

Si el script automático no funciona, puedes descargar las imágenes manualmente siguiendo estos pasos:

## Método 1: Usando el Navegador

1. Visita https://www.chimeneasluque.com
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Network** (Red)
4. Filtra por **Img** (Imágenes)
5. Navega por las secciones del sitio (Hornos, Chimeneas, Fogatas)
6. Para cada imagen:
   - Haz clic derecho en la imagen en la lista de Network
   - Selecciona "Open in new tab" (Abrir en nueva pestaña)
   - Guarda la imagen con el nombre apropiado (hornos1.jpg, chimeneas1.jpg, etc.)
   - Colócala en la carpeta correspondiente: `public/images/hornos/`, `public/images/chimeneas/`, o `public/images/fogatas/`

## Método 2: Usando wget (Windows)

Si tienes wget instalado:

```bash
# Descargar imágenes de hornos
wget -r -l 1 -H -t 1 -nd -N -np -A.jpg,.jpeg,.png -erobots=off -P public/images/hornos https://www.chimeneasluque.com/hornos

# Descargar imágenes de chimeneas
wget -r -l 1 -H -t 1 -nd -N -np -A.jpg,.jpeg,.png -erobots=off -P public/images/chimeneas https://www.chimeneasluque.com/chimeneas

# Descargar imágenes de fogatas
wget -r -l 1 -H -t 1 -nd -N -np -A.jpg,.jpeg,.png -erobots=off -P public/images/fogatas https://www.chimeneasluque.com/fogatas
```

## Método 3: Usando PowerShell

```powershell
# Crear directorios
New-Item -ItemType Directory -Force -Path "public\images\hornos"
New-Item -ItemType Directory -Force -Path "public\images\chimeneas"
New-Item -ItemType Directory -Force -Path "public\images\fogatas"

# Descargar imágenes (ejemplo)
$url = "https://www.chimeneasluque.com/images/hornos/horno1.jpg"
$output = "public\images\hornos\horno1.jpg"
Invoke-WebRequest -Uri $url -OutFile $output
```

## Estructura de Carpetas

```
public/
  images/
    hornos/
      horno1.jpg
      horno2.jpg
      ...
    chimeneas/
      chimenea1.jpg
      chimenea2.jpg
      ...
    fogatas/
      fogata1.jpg
      fogata2.jpg
      ...
```

## Nombres de Archivos

Asegúrate de nombrar las imágenes según el patrón:
- Hornos: `horno1.jpg`, `horno2.jpg`, etc. (hasta 14)
- Chimeneas: `chimenea1.jpg`, `chimenea2.jpg`, etc. (hasta 32)
- Fogatas: `fogata1.jpg`, `fogata2.jpg`, etc. (hasta 14)

## Notas Importantes

- Las imágenes deben estar en formato JPG, PNG, o WebP
- Los nombres de archivo deben seguir el patrón mencionado
- Las imágenes se cargarán automáticamente en la aplicación una vez que estén en las carpetas correctas

