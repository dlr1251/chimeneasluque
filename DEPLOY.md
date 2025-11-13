# Guía de Despliegue - GitHub y Vercel

Esta guía te ayudará a desplegar la aplicación Chimeneas Luque en GitHub y Vercel.

## Paso 1: Inicializar Git (si aún no lo has hecho)

```bash
git init
git add .
git commit -m "Initial commit: Chimeneas Luque Next.js app"
```

## Paso 2: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón "New" o ve a https://github.com/new
3. Completa el formulario:
   - **Repository name**: `chimeneasluque` (o el nombre que prefieras)
   - **Description**: "Sitio web de Chimeneas Luque - Clon Next.js"
   - **Visibility**: Elige Público o Privado
   - **NO** marques "Initialize this repository with a README" (ya tenemos archivos)
4. Haz clic en "Create repository"

## Paso 3: Conectar Repositorio Local con GitHub

Después de crear el repositorio en GitHub, verás instrucciones. Ejecuta estos comandos:

```bash
# Reemplaza YOUR_USERNAME con tu nombre de usuario de GitHub
git remote add origin https://github.com/YOUR_USERNAME/chimeneasluque.git
git branch -M main
git push -u origin main
```

**Alternativa usando SSH** (si tienes configurado SSH):
```bash
git remote add origin git@github.com:YOUR_USERNAME/chimeneasluque.git
git branch -M main
git push -u origin main
```

## Paso 4: Desplegar en Vercel

### Opción A: Despliegue Automático desde GitHub (Recomendado)

1. Ve a [Vercel](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub)
2. Haz clic en "Add New Project"
3. Selecciona el repositorio `chimeneasluque` de la lista
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Configura el proyecto:
   - **Framework Preset**: Next.js (debería detectarse automáticamente)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (por defecto)
   - **Output Directory**: `.next` (por defecto)
   - **Install Command**: `npm install` (por defecto)
6. Haz clic en "Deploy"
7. Vercel construirá y desplegará tu aplicación automáticamente
8. Una vez completado, obtendrás una URL como `https://chimeneasluque.vercel.app`

### Opción B: Despliegue usando Vercel CLI

Si prefieres usar la línea de comandos:

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Desplegar (primera vez)
vercel

# Seguir las instrucciones en pantalla
# Desplegar a producción
vercel --prod
```

## Paso 5: Configurar Variables de Entorno (si es necesario)

Si en el futuro necesitas variables de entorno:

1. Ve a tu proyecto en Vercel
2. Ve a "Settings" > "Environment Variables"
3. Agrega las variables necesarias
4. Vuelve a desplegar

## Configuración Automática de Vercel

El archivo `vercel.json` ya está configurado con los parámetros necesarios. Vercel detectará automáticamente:

- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`

## Dominio Personalizado (Opcional)

Para usar un dominio personalizado:

1. Ve a tu proyecto en Vercel
2. Ve a "Settings" > "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

## Actualizaciones Futuras

Cada vez que hagas `git push` a la rama `main`, Vercel desplegará automáticamente una nueva versión:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Vercel creará un preview deployment para cada pull request también.

## Verificación Post-Despliegue

Después del despliegue, verifica:

- ✅ Las imágenes se cargan correctamente
- ✅ Todos los enlaces funcionan
- ✅ El formulario de contacto funciona
- ✅ La navegación es suave
- ✅ El sitio es responsive en móviles

## Solución de Problemas

### Error: "Build failed"

1. Verifica que `package.json` tenga todos los scripts necesarios
2. Verifica que todas las dependencias estén instaladas
3. Revisa los logs de build en Vercel

### Error: "Images not loading"

1. Verifica que las imágenes estén en `public/images/`
2. Verifica que los nombres de archivo coincidan con lo esperado
3. Revisa la configuración de `next.config.js`

### Error: "Module not found"

1. Verifica que todas las dependencias estén en `package.json`
2. Ejecuta `npm install` localmente y verifica que funcione
3. Verifica los paths de importación (asegúrate de usar `@/` para alias)

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [GitHub Guides](https://guides.github.com)

