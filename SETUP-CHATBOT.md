# Configuración Rápida del Chatbot

## ⚠️ Error: "XAI API key not configured"

Si ves este error, necesitas configurar tu API key de xAI.

## Pasos para Configurar

### 1. Obtener tu API Key de xAI

1. Visita [https://console.x.ai](https://console.x.ai)
2. Inicia sesión con tu cuenta
3. Ve a la sección de API Keys
4. Crea una nueva API key o copia una existente

### 2. Crear el archivo `.env.local`

En la raíz del proyecto, crea un archivo llamado `.env.local` con el siguiente contenido:

```bash
XAI_API_KEY=tu_api_key_real_aqui
```

**Reemplaza `tu_api_key_real_aqui` con tu API key real de xAI.**

### 3. Reiniciar el servidor de desarrollo

Después de crear el archivo `.env.local`:

1. Detén el servidor (Ctrl+C)
2. Inicia el servidor de nuevo:
   ```bash
   npm run dev
   ```

### 4. Verificar la configuración

Una vez configurado, el chatbot debería funcionar. Si no tienes API key configurada, el chatbot usará las FAQs locales como fallback.

## Configuración Completa (Opcional)

Si quieres personalizar más la configuración, puedes añadir estas variables opcionales a tu `.env.local`:

```bash
XAI_API_KEY=tu_api_key_aqui
XAI_API_URL=https://api.x.ai/v1/chat/completions
XAI_MODEL=grok-beta
XAI_COLLECTION_ID=collection_05bc70b6-74a2-4e41-a698-11d261dbad08
```

## Solución de Problemas

### El error persiste después de configurar

1. **Verifica que el archivo se llama exactamente `.env.local`** (con el punto al inicio)
2. **Asegúrate de que esté en la raíz del proyecto** (mismo nivel que `package.json`)
3. **Reinicia el servidor** después de crear/modificar el archivo
4. **Verifica que no haya espacios** alrededor del signo `=` en el archivo `.env.local`

### Ejemplo de archivo `.env.local` correcto:

```
XAI_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Ejemplo INCORRECTO (con espacios):

```
XAI_API_KEY = xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ❌
```

## Nota de Seguridad

⚠️ **NUNCA** compartas tu API key públicamente ni la subas a Git. El archivo `.env.local` ya está en `.gitignore` y no se subirá al repositorio.

