import { NextResponse } from 'next/server';
import { getContextForChatbot, findRelevantFAQs } from '@/lib/customer-service';

export async function POST(request: Request) {
  const startTime = Date.now();
  let message: string = '';
  let conversationHistory: any[] = [];

  // Leer el body una sola vez
  try {
    const body = await request.json();
    message = body.message || '';
    conversationHistory = body.conversationHistory || [];
    console.log('[Chat API] Request received:', {
      messageLength: message.length,
      historyLength: conversationHistory.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Chat API] Error parsing request body:', error);
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
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.log('[Chat API] Configuration check:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    isDevelopment,
    hasFAQs: relevantFAQs.length > 0
  });
  
  // Si no hay API key, usar directamente las FAQs
  if (!apiKey) {
    console.warn('[Chat API] XAI_API_KEY not configured, using FAQ fallback');
    if (relevantFAQs.length > 0) {
      return NextResponse.json({
        message: relevantFAQs[0].answer,
        source: 'faq',
        fallback: true,
        debug: isDevelopment ? { reason: 'No API key configured' } : undefined
      });
    }
    return NextResponse.json(
      { 
        error: 'XAI API key not configured',
        message: 'Por favor, configure la variable de entorno XAI_API_KEY. Mientras tanto, puede contactarnos directamente a través del formulario de contacto.',
        debug: isDevelopment ? { reason: 'No API key and no FAQs available' } : undefined
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
    
    console.log('[Chat API] Preparing xAI request:', {
      apiUrl,
      model,
      hasCollectionId: !!collectionId,
      messagesCount: messages.length,
      systemPromptLength: systemPrompt.length
    });
    
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
    
    const requestStartTime = Date.now();
    console.log('[Chat API] Sending request to xAI...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const requestDuration = Date.now() - requestStartTime;
    console.log('[Chat API] xAI response received:', {
      status: response.status,
      statusText: response.statusText,
      duration: `${requestDuration}ms`,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        try {
          errorData = await response.text();
        } catch {
          errorData = 'Could not parse error response';
        }
      }
      
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        collectionId: collectionId,
        model: model,
        apiUrl: apiUrl,
        requestDuration: `${requestDuration}ms`
      };
      
      console.error('[Chat API] xAI API Error:', errorDetails);
      
      // Si la API falla, proporcionar una respuesta básica usando las FAQs
      const relevantFAQ = relevantFAQs[0];
      if (relevantFAQ) {
        return NextResponse.json({
          message: relevantFAQ.answer,
          source: 'faq',
          fallback: true,
          debug: isDevelopment ? errorDetails : undefined
        });
      }
      
      return NextResponse.json(
        { 
          error: 'Error al comunicarse con el asistente',
          message: 'Lo sentimos, estamos experimentando problemas técnicos. Por favor, contacte con nosotros directamente a través del formulario de contacto.',
          fallback: true,
          debug: isDevelopment ? errorDetails : undefined
        },
        { status: 500 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Error parsing xAI response:', parseError);
      const relevantFAQ = relevantFAQs[0];
      if (relevantFAQ) {
        return NextResponse.json({
          message: relevantFAQ.answer,
          source: 'faq',
          fallback: true
        });
      }
      throw new Error('Failed to parse API response');
    }
    
    const assistantMessage = data.choices?.[0]?.message?.content || 
      data.message || 
      'Lo sentimos, no pude procesar tu mensaje. Por favor, intenta de nuevo.';

    return NextResponse.json({
      message: assistantMessage,
      source: 'grok'
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error('[Chat API] Unexpected error:', error);
    
    // Log detallado del error para debugging
    const errorDetails: any = {
      duration: `${totalDuration}ms`,
      timestamp: new Date().toISOString()
    };
    
    if (error instanceof Error) {
      errorDetails.message = error.message;
      errorDetails.stack = error.stack;
      errorDetails.name = error.name;
      console.error('[Chat API] Error details:', errorDetails);
    } else {
      errorDetails.unknownError = error;
      console.error('[Chat API] Unknown error:', errorDetails);
    }
    
    // Fallback a FAQs si hay un error (usar el mensaje que ya leímos)
    if (message && relevantFAQs.length > 0) {
      console.log('[Chat API] Using FAQ fallback due to error');
      return NextResponse.json({
        message: relevantFAQs[0].answer,
        source: 'faq',
        fallback: true,
        debug: isDevelopment ? errorDetails : undefined
      });
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Lo sentimos, estamos experimentando problemas técnicos. Por favor, contacte con nosotros directamente a través del formulario de contacto.',
        fallback: true,
        debug: isDevelopment ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

