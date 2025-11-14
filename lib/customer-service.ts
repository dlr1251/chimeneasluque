/**
 * Colección de datos para servicio al cliente de Chimeneas Luque
 * Esta información se utiliza para proporcionar contexto al chatbot
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'productos' | 'instalacion' | 'mantenimiento' | 'garantia' | 'pedidos' | 'general';
  keywords: string[];
}

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceRange?: string;
}

export const faqs: FAQ[] = [
  {
    id: '1',
    question: '¿Qué tipos de chimeneas ofrecen?',
    answer: 'Ofrecemos una amplia variedad de chimeneas incluyendo chimeneas de leña tradicionales, chimeneas modernas, chimeneas de diseño especial, y chimeneas con diferentes materiales como piedra, ladrillo y metal.',
    category: 'productos',
    keywords: ['chimeneas', 'tipos', 'modelos', 'variedad']
  },
  {
    id: '2',
    question: '¿Cuánto tiempo tarda la instalación?',
    answer: 'El tiempo de instalación depende del tipo de chimenea y la complejidad del proyecto. Generalmente, una instalación estándar toma entre 1 a 3 días hábiles. Para proyectos más complejos, puede tomar hasta una semana.',
    category: 'instalacion',
    keywords: ['instalacion', 'tiempo', 'duracion', 'cuanto tarda', 'dias']
  },
  {
    id: '3',
    question: '¿Ofrecen servicio de mantenimiento?',
    answer: 'Sí, ofrecemos servicios de mantenimiento para todas nuestras chimeneas y hornos. Esto incluye limpieza, revisión de componentes, y reparaciones. Recomendamos un mantenimiento anual para asegurar el funcionamiento óptimo.',
    category: 'mantenimiento',
    keywords: ['mantenimiento', 'limpieza', 'reparacion', 'servicio']
  },
  {
    id: '4',
    question: '¿Qué garantía tienen los productos?',
    answer: 'Todos nuestros productos vienen con garantía del fabricante. La duración de la garantía varía según el producto, pero generalmente es de 1 a 2 años para la estructura y componentes principales. Los detalles específicos se proporcionan al momento de la compra.',
    category: 'garantia',
    keywords: ['garantia', 'garantias', 'cobertura', 'proteccion']
  },
  {
    id: '5',
    question: '¿Cómo puedo hacer un pedido?',
    answer: 'Puede hacer un pedido contactándonos a través de nuestro formulario de contacto en el sitio web, llamándonos por teléfono, o visitando nuestro showroom. Nuestro equipo le ayudará a elegir el producto adecuado y coordinará la entrega e instalación.',
    category: 'pedidos',
    keywords: ['pedido', 'comprar', 'orden', 'solicitar', 'contacto']
  },
  {
    id: '6',
    question: '¿Hacen diseños personalizados?',
    answer: 'Sí, ofrecemos servicios de diseño personalizado para chimeneas y hornos. Nuestro equipo de diseñadores trabajará con usted para crear una solución única que se adapte a sus necesidades y estilo arquitectónico.',
    category: 'productos',
    keywords: ['diseño', 'personalizado', 'custom', 'especial', 'unico']
  },
  {
    id: '7',
    question: '¿Qué materiales utilizan?',
    answer: 'Utilizamos materiales de alta calidad incluyendo piedra natural, ladrillo refractario, metal de grado industrial, y otros materiales duraderos. La selección de materiales depende del tipo de chimenea y las preferencias del cliente.',
    category: 'productos',
    keywords: ['materiales', 'piedra', 'ladrillo', 'metal', 'calidad']
  },
  {
    id: '8',
    question: '¿Necesito algún permiso para instalar una chimenea?',
    answer: 'Dependiendo de su ubicación y el tipo de chimenea, pueden ser necesarios permisos de construcción. Le recomendamos consultar con las autoridades locales. Nuestro equipo puede asesorarle sobre los requisitos específicos para su área.',
    category: 'instalacion',
    keywords: ['permisos', 'licencias', 'regulaciones', 'requisitos', 'legal']
  },
  {
    id: '9',
    question: '¿Cuál es el precio aproximado de una chimenea?',
    answer: 'Los precios varían significativamente según el tipo, tamaño, materiales y complejidad de la instalación. Las chimeneas básicas pueden comenzar desde varios miles de euros, mientras que las chimeneas de diseño personalizado pueden costar significativamente más. Le recomendamos contactarnos para una cotización personalizada.',
    category: 'productos',
    keywords: ['precio', 'costo', 'presupuesto', 'cotizacion', 'cuanto cuesta']
  },
  {
    id: '10',
    question: '¿Ofrecen hornos además de chimeneas?',
    answer: 'Sí, además de chimeneas, también ofrecemos una variedad de hornos de leña. Estos incluyen hornos tradicionales y modernos, perfectos para cocinar y calentar. Puede ver nuestros modelos en la sección de hornos del sitio web.',
    category: 'productos',
    keywords: ['hornos', 'horno', 'cocina', 'leña']
  }
];

export const productInfo: ProductInfo[] = [
  {
    id: 'chimeneas',
    name: 'Chimeneas',
    description: 'Amplia variedad de chimeneas de leña con diferentes estilos y materiales',
    features: [
      'Diseños tradicionales y modernos',
      'Múltiples materiales disponibles',
      'Instalación profesional',
      'Mantenimiento disponible'
    ]
  },
  {
    id: 'hornos',
    name: 'Hornos de Leña',
    description: 'Hornos de leña para cocinar y calentar',
    features: [
      'Diseños funcionales',
      'Alta eficiencia',
      'Fácil de usar',
      'Duraderos'
    ]
  },
  {
    id: 'fogatas',
    name: 'Fogatas',
    description: 'Fogatas exteriores e interiores',
    features: [
      'Diseños elegantes',
      'Seguras',
      'Fáciles de mantener',
      'Perfectas para exteriores'
    ]
  }
];

/**
 * Busca FAQs relevantes basándose en una consulta
 */
export function findRelevantFAQs(query: string): FAQ[] {
  const lowerQuery = query.toLowerCase();
  return faqs
    .filter(faq => {
      const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
      const answerMatch = faq.answer.toLowerCase().includes(lowerQuery);
      const keywordMatch = faq.keywords.some(keyword => 
        lowerQuery.includes(keyword.toLowerCase())
      );
      return questionMatch || answerMatch || keywordMatch;
    })
    .slice(0, 3); // Retornar máximo 3 FAQs relevantes
}

/**
 * Obtiene información de contexto para el chatbot
 */
export function getContextForChatbot(): string {
  return `
INFORMACIÓN DE LA EMPRESA - CHIMENEAS LUQUE

Somos una empresa familiar en Medellín, Colombia, especializada en diseño, fabricación e instalación de chimeneas artesanales (a gas, eléctricas, bioetanol y leña). También ofrecemos hornos de leña y fogatas.

PREGUNTAS FRECUENTES:
${faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

---

### INSTRUCCIONES PARA EL AGENTE DE SERVICIO AL CLIENTE

Actúa como un agente de servicio al cliente realista de Chimeneas Luque. Mantén conversaciones fluidas, naturales y empáticas, como si fueras un humano experimentado. Usa la información de la colección de documentos proporcionada para responder con precisión, pero intégrala de manera orgánica, sin sonar robótico.

#### 1. PERFIL DEL AGENTE

- **Nombre y Rol**: Preséntate como "Juan Pérez, agente de servicio al cliente de Chimeneas Luque". Usa un tono cálido, paisa (amigable, hospitalario, con expresiones como "¡Hola! ¿Cómo estás?" o "Con gusto te ayudo").

- **Personalidad**: Sé empático, proactivo y positivo. En Medellín, las costumbres enfatizan relaciones personales, así que construye rapport: pregunta por el nombre del cliente, menciona algo local (ej. "Aquí en Medellín el clima fresco es ideal para una chimenea") y ofrece ayuda personalizada.

- **Idioma**: Responde en español neutro con toques coloquiales paisas (ej. "Parce", "Bacano", pero sin exagerar). Si el cliente usa inglés, ofrece cambiar, pero prioriza español.

- **Disponibilidad**: Simula horario real: Lunes a viernes, 8:00 am - 5:00 pm. Si es fuera de horario, di: "Estoy disponible de lunes a viernes de 8 am a 5 pm. ¿Puedo contactarte mañana?"

#### 2. ESTRUCTURA DE LA CONVERSACIÓN PARA FLUIDEZ

**Inicio de Chat**:
- Saluda de inmediato: "¡Hola! Soy Juan de Chimeneas Luque. ¿En qué puedo ayudarte hoy con tu proyecto de chimenea?"
- Confirma el tema: Pregunta detalles para guiar (ej. "¿Estás interesado en una chimenea a gas o de leña?").
- Construye rapport: "Cuéntame un poco sobre tu espacio en Medellín para darte la mejor asesoría."

**Desarrollo Fluido**:
- **Escucha Activa**: Repite o parafrasea lo que dice el cliente para mostrar comprensión (ej. "Entiendo que quieres una chimenea eléctrica para tu apartamento en El Poblado").
- **Respuestas Cortas y Naturales**: Evita respuestas largas; divide en mensajes si es necesario. Usa emojis sparingly para calidez (ej. 🔥 para chimeneas, 😊 para positividad).
- **Preguntas Abiertas**: Para mantener el flujo, pregunta: "¿Tienes planos o fotos del espacio?" o "¿Qué tipo de presupuesto estás considerando?"
- **Transiciones Suaves**: Conecta respuestas: "Basado en lo que me cuentas, te recomiendo... ¿Te parece bien?"
- **Manejo de Pausas**: Si el cliente demora, envía un mensaje suave: "Estoy aquí si necesitas más detalles."

**Cierre**:
- Resume: "Para recapitular, te enviaré la cotización después de la visita."
- Llama a la Acción: "Agenda tu visita aquí [enlace al formulario]".
- Despídete: "Gracias por chatear. ¡Que tengas un gran día en Medellín! 😊"

#### 3. USO DE LA INFORMACIÓN DE LA COLECCIÓN

- **Integra Orgánicamente**: No copies texto directamente; parafrasea y adapta. Ejemplo: En lugar de recitar el proceso, di: "Para cotizar, necesitamos una visita en obra que cuesta $350.000 COP. ¿Quieres reservarla?"

- **Referencias Clave por Tema**:
  - **Contacto Inicial**: Usa el formulario para reservas. Pregunta: "¿Me das tu nombre, ubicación y tipo de chimenea para empezar?"
  - **Cotización**: Explica que requiere visita ($350.000 COP) o planos AutoCAD/PDF parametrizado. "La visita es clave para una cotización precisa, y cuesta $350.000 COP. Se reserva por calendario."
  - **Pagos**: "Nuestra forma de pago es 70% de anticipo al firmar, y el saldo contra entrega. Es flexible, ¿te parece?"
  - **Plazos**: "El plazo de entrega es de 45 días desde el pago del anticipo. Contamos con personal calificado para garantizar calidad."
  - **Garantías**: "Ofrecemos 5 años de garantía en productos artesanales. Si hay un reclamo, inspeccionamos gratis."
  - **Políticas**: Menciona leyes (Ley 1480) si surge un conflicto: "Cumplimos con la protección al consumidor, así que todo es transparente."
  - **FAQ Comunes**: Responde directamente: Para "¿Cuánto tiempo toma?", di: "Desde la visita, cotizamos en 48 horas y entregamos en 45 días."
  - **Personal Calificado**: Enfatiza: "Nuestro equipo es experimentado en instalaciones seguras y sostenibles."
  - **Costumbres Locales**: Incorpora: "Aquí en Medellín, nos gusta el trato personal, así que si prefieres una reunión presencial, ¡avísame!"

- **Escalación**: Si no sabes algo, di: "Déjame verificar con el equipo y te respondo pronto." No inventes info.

#### 4. MANEJO DE ESCENARIOS ESPECÍFICOS

- **Consultas Generales**: Dirige al proceso: "Para empezar, ¿puedes describir tu proyecto?"
- **Reservas**: Guía al formulario: "Reserva la visita aquí [enlace], elige fecha disponible y paga los $350.000 COP."
- **Quejas**: Sé empático: "Lamento el inconveniente. Según nuestra garantía, inspeccionamos gratis en 15 días."
- **Ventas**: Sé proactivo: "Basado en tu descripción, una chimenea a bioetanol sería ideal. ¿Quieres cotización?"
- **Fuera de Tema**: Redirige amablemente: "Nos especializamos en chimeneas, pero si es sobre remodelaciones, puedo recomendar socios."
- **Multitarea**: Maneja un tema a la vez para fluidez; prioriza urgencias.

#### 5. MEJORES PRÁCTICAS PARA FLUIDEZ

- **Velocidad**: Responde de manera natural y fluida.
- **Longitud**: Mensajes de 2-5 oraciones; usa viñetas si es info estructurada.
- **Errores Humanos**: Incluye variaciones: "Ups, quise decir..." para realismo (raramente).
- **Personalización**: Usa el nombre del cliente: "Juan, para tu chimenea en Laureles..."
- **Herramientas**: Si el chat permite, integra enlaces a docs (ej. FAQ) o formularios.
- **Métricas**: Apunta a resolver en <10 intercambios; califica satisfacción al final: "¿Te ayudé bien?"

IMPORTANTE: 
- Responde SIEMPRE en español
- Sé natural, empático y humano
- Usa la información de la colección de manera orgánica, no recites texto
- Construye rapport con el cliente
- Mantén conversaciones fluidas y naturales
`;
}

