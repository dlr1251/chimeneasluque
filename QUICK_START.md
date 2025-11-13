# Guía de Inicio Rápido - GitHub y Vercel

Esta es una guía rápida para desplegar la aplicación Chimeneas Luque en GitHub y Vercel.

## ✅ Paso 1: Repositorio Git Inicializado

El repositorio Git ya está inicializado y el commit inicial está hecho.

## 📤 Paso 2: Crear Repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. **Nombre del repositorio**: `chimeneasluque` (o el que prefieras)
3. **Descripción**: "Sitio web de Chimeneas Luque - Next.js"
4. **Visibilidad**: Público o Privado (tu elección)
5. **NO marques**: "Initialize this repository with a README"
6. Haz clic en **"Create repository"**

## 🔗 Paso 3: Conectar Local con GitHub

Después de crear el repositorio, GitHub te mostrará instrucciones. Ejecuta estos comandos:

```bash
# Reemplaza YOUR_USERNAME con tu usuario de GitHub
git remote add origin https://github.com/YOUR_USERNAME/chimeneasluque.git
git branch -M main
git push -u origin main
```

Si te pide credenciales, usa tu GitHub Personal Access Token (no tu contraseña).

## 🚀 Paso 4: Desplegar en Vercel

### Método 1: Desde la Web (Recomendado)

1. Ve a [https://vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **"Add New Project"** o **"Import Project"**
3. Selecciona el repositorio `chimeneasluque`
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Haz clic en **"Deploy"**
6. Espera a que termine el build (2-3 minutos)
7. ¡Listo! Obtendrás una URL como `https://chimeneasluque.vercel.app`

### Método 2: Desde la Terminal (CLI)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Seguir las instrucciones en pantalla
# Para producción:
vercel --prod
```

## ✨ Características Automáticas

Una vez conectado, Vercel automáticamente:

- ✅ Detectará cada `git push` a `main`
- ✅ Construirá y desplegará automáticamente
- ✅ Creará preview deployments para cada Pull Request
- ✅ Optimizará las imágenes automáticamente
- ✅ Proporcionará HTTPS y CDN global

## 📝 Próximos Pasos

1. **Hacer cambios y desplegar:**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   # Vercel desplegará automáticamente
   ```

2. **Ver el sitio desplegado:**
   - Ve a tu proyecto en Vercel
   - Haz clic en la URL de producción

3. **Configurar dominio personalizado (opcional):**
   - Settings > Domains
   - Agrega tu dominio

## 🆘 Problemas Comunes

### Error: "Repository not found"
- Verifica que el nombre del repositorio sea correcto
- Verifica que tengas permisos para acceder al repositorio

### Error: "Build failed"
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en `package.json`

### Las imágenes no se cargan
- Verifica que las imágenes estén en `public/images/`
- Asegúrate de que estén commitadas en Git

## 📚 Recursos

- [Guía Completa de Despliegue](./DEPLOY.md)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)

