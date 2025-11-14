import { NextResponse } from 'next/server';
import { getContextForChatbot, findRelevantFAQs } from '@/lib/customer-service';

export async function POST(request: Request) {
  let message: string = '';
  let conversationHistory: any[] = [];

  // Leer el body una sola vez
  try {
    const body = await request.json();
    message = body.message || '';
    conversationHistory = body.conversationHistory || [];
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', message: 'Por favor, envía un mensaje válido.' },
      { status: 400 }
    );
  }

  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { error: 'Message is required', message: 'Por favor, envía un mensaje válido.' },
      { status: 400 }
    );
  }

  // Buscar FAQs relevantes para proporcionar contexto (siempre útil como fallback)
  const relevantFAQs = findRelevantFAQs(message);

  // Obtener API key de xAI desde variables de entorno
  const apiKey = process.env.XAI_API_KEY;
  
  // Si no hay API key, usar directamente las FAQs
  if (!apiKey) {
    if (relevantFAQs.length > 0) {
      return NextResponse.json({
        message: relevantFAQs[0].answer,
        source: 'faq',
        fallback: true
      });
    }
    return NextResponse.json(
      { 
        error: 'XAI API key not configured',
        message: 'Por favor, configure la variable de entorno XAI_API_KEY. Mientras tanto, puede contactarnos directamente a través del formulario de contacto.'
      },
      { status: 500 }
    );
  }

  try {
    const context = getContextForChatbot();
    
    // Construir el mensaje del sistema con contexto
    // El contexto ya incluye todas las instrucciones detalladas
    const systemPrompt = context;

    // Construir el historial de conversación
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Llamar a la API de xAI Grok
    // Nota: Verifica la URL y modelo correctos en la documentación oficial de xAI
    // Documentación: https://docs.x.ai o https://console.x.ai
    // Posibles endpoints:
    // - https://api.x.ai/v1/chat/completions
    // - https://api.x.ai/v1/completions
    // Modelos disponibles pueden ser: 'grok-beta', 'grok-2', 'grok-3', etc.
    const apiUrl = process.env.XAI_API_URL || 'https://api.x.ai/v1/chat/completions';
    const model = process.env.XAI_MODEL || 'grok-4-fast-non-reasoning';
    const collectionId = process.env.XAI_COLLECTION_ID || 'collection_05bc70b6-74a2-4e41-a698-11d261dbad08';
    
    // Construir el body de la petición
    const requestBody: any = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    };

    // Incluir la colección si está disponible
    // Nota: El formato del parámetro puede variar según la versión de la API de xAI
    // Formatos comunes: 'collection_id', 'collection', o como parte de 'tools'
    if (collectionId) {
      requestBody.collection_id = collectionId;
      // Si 'collection_id' no funciona, prueba descomentar la siguiente línea:
      // requestBody.collection = collectionId;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('xAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        collectionId: collectionId,
        model: model
      });
      
      // Si la API falla, proporcionar una respuesta básica usando las FAQs
      const relevantFAQ = relevantFAQs[0];
      if (relevantFAQ) {
        return NextResponse.json({
          message: relevantFAQ.answer,
          source: 'faq',
          fallback: true
        });
      }
      
      return NextResponse.json(
        { 
          error: 'Error al comunicarse con el asistente',
          message: 'Lo sentimos, estamos experimentando problemas técnicos. Por favor, contacte con nosotros directamente a través del formulario de contacto.',
          fallback: true
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 
      'Lo sentimos, no pude procesar tu mensaje. Por favor, intenta de nuevo.';

    return NextResponse.json({
      message: assistantMessage,
      source: 'grok'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Fallback a FAQs si hay un error (usar el mensaje que ya leímos)
    if (message && relevantFAQs.length > 0) {
      return NextResponse.json({
        message: relevantFAQs[0].answer,
        source: 'faq',
        fallback: true
      });
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Lo sentimos, ocurrió un error. Por favor, contacte con nosotros directamente a través del formulario de contacto.',
        fallback: true
      },
      { status: 500 }
    );
  }
}

