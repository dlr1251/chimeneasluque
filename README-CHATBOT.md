# Chatbot con xAI Grok - Documentación

Este proyecto incluye un chatbot integrado con xAI Grok para proporcionar servicio al cliente automatizado.

## 🚀 Características

- **Chatbot Inteligente**: Integrado con xAI Grok para respuestas contextuales
- **Colección de Servicio al Cliente**: Base de conocimiento con FAQs y información de productos
- **UI Moderna**: Interfaz de chat flotante y página dedicada
- **Fallback Inteligente**: Si la API de Grok no está disponible, usa las FAQs locales

## 📋 Requisitos Previos

1. **Cuenta de xAI**: Necesitas una cuenta en xAI y una API key
2. **API Key**: Obtén tu API key desde [xAI Console](https://console.x.ai)

## ⚙️ Configuración

### 1. Obtener API Key de xAI

1. Visita [https://console.x.ai](https://console.x.ai)
2. Inicia sesión con tu cuenta
3. Crea una nueva API key
4. Copia la API key generada

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Requerido
XAI_API_KEY=tu_api_key_aqui

# Opcional (valores por defecto incluidos)
XAI_API_URL=https://api.x.ai/v1/chat/completions
XAI_MODEL=grok-beta
XAI_COLLECTION_ID=collection_05bc70b6-74a2-4e41-a698-11d261dbad08
```

**Nota sobre la Colección**: 
- La colección `collection_05bc70b6-74a2-4e41-a698-11d261dbad08` está configurada por defecto
- Esta colección contiene información adicional de conocimiento para el chatbot
- Puedes cambiarla configurando `XAI_COLLECTION_ID` con el ID de tu propia colección

**Importante**: 
- No compartas tu API key públicamente
- Añade `.env.local` a tu `.gitignore` (ya debería estar incluido)
- En producción (Vercel, etc.), configura la variable de entorno en el panel de configuración

### 3. Configuración en Vercel (Producción)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade `XAI_API_KEY` con tu API key
4. Redeploy el proyecto

## 📁 Estructura de Archivos

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route para el chatbot
│   └── chat/
│       └── page.tsx               # Página dedicada del chat
├── components/
│   └── Chatbot.tsx                # Componente del chatbot
├── lib/
│   └── customer-service.ts        # Colección de FAQs y datos
└── .env.local                     # Variables de entorno (no en git)
```

## 🎯 Uso

### Chatbot Flotante

El chatbot aparece automáticamente en todas las páginas como un botón flotante en la esquina inferior derecha. Los usuarios pueden:

1. Hacer clic en el botón para abrir el chat
2. Escribir sus preguntas
3. Recibir respuestas del asistente virtual

### Página Dedicada

Visita `/chat` para una experiencia de chat completa con información adicional sobre las capacidades del asistente.

### Navegación

El enlace "CHAT" está disponible en el menú principal del header.

## 📚 Colección de Servicio al Cliente

La colección de servicio al cliente se encuentra en `lib/customer-service.ts` e incluye:

- **FAQs**: Preguntas frecuentes con respuestas
- **Información de Productos**: Detalles sobre chimeneas, hornos y fogatas
- **Funciones de Búsqueda**: Búsqueda inteligente de FAQs relevantes

### Agregar Nuevas FAQs

Edita `lib/customer-service.ts` y añade nuevas entradas al array `faqs`:

```typescript
{
  id: '11',
  question: 'Tu pregunta aquí',
  answer: 'Tu respuesta aquí',
  category: 'productos', // o 'instalacion', 'mantenimiento', etc.
  keywords: ['palabra', 'clave', 'relevante']
}
```

## 🔧 Personalización

### Modificar el Prompt del Sistema

Edita la función `getContextForChatbot()` en `lib/customer-service.ts` para cambiar cómo se comporta el asistente.

### Cambiar el Modelo de Grok

En `app/api/chat/route.ts`, puedes cambiar el modelo:

```typescript
model: 'grok-beta', // Cambia a 'grok-2' o el modelo que prefieras
```

### Personalizar la UI

El componente `Chatbot.tsx` puede ser personalizado para cambiar:
- Colores y estilos
- Tamaño de la ventana
- Posición del botón flotante
- Mensajes iniciales

## 🐛 Solución de Problemas

### Error: "XAI API key not configured"

- Verifica que has creado el archivo `.env.local`
- Asegúrate de que la variable se llama exactamente `XAI_API_KEY`
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`

### Error: "Error al comunicarse con el asistente"

- Verifica que tu API key es válida
- Comprueba que tienes créditos/quota en tu cuenta de xAI
- Revisa la consola del servidor para más detalles
- El sistema usará las FAQs como fallback automáticamente

### El chatbot no aparece

- Verifica que has importado el componente `Chatbot` en la página
- Revisa la consola del navegador para errores
- Asegúrate de que no hay conflictos de z-index con otros elementos

## 🔒 Seguridad

- **Nunca** commits el archivo `.env.local` al repositorio
- Usa variables de entorno en producción
- La API key se usa solo en el servidor (API route), nunca en el cliente
- Considera implementar rate limiting para prevenir abuso

## 📝 Notas Adicionales

- El chatbot usa un sistema de fallback: si Grok no está disponible, usa las FAQs locales
- Las conversaciones no se guardan (cada mensaje es independiente)
- Para guardar historial, necesitarías implementar una base de datos
- El modelo por defecto es `grok-beta`, pero puedes cambiarlo según disponibilidad

## 🚀 Próximas Mejoras

Posibles mejoras futuras:
- Guardar historial de conversaciones
- Integración con base de datos para FAQs dinámicas
- Análisis de sentimiento
- Soporte multiidioma
- Integración con CRM

