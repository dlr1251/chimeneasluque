# Instrucciones para el Agente - Formulario de Contacto

## Contexto

El formulario de contacto de Chimeneas Luque está diseñado para recopilar información técnica detallada necesaria para proporcionar cotizaciones precisas y asesoramiento adecuado sobre instalaciones de chimeneas, hornos y fogatas.

## Campos del Formulario y Detalles Técnicos

Cuando el agente interactúe con usuarios o procese solicitudes de contacto, debe tener en cuenta los siguientes campos y detalles técnicos:

### 1. Información de Contacto

- **Nombre completo**: Identificación del cliente
- **Teléfono de contacto**: Validado para formato correcto (números, +, espacios, paréntesis, guiones)
- **Ubicación (Municipio)**: Importante para evaluar logística, disponibilidad de materiales, y reglamentaciones locales

### 2. Detalles Técnicos de la Instalación

Estos son **CRÍTICOS** para el agente al proporcionar asesoramiento:

#### **Estado de Ejecución de la Obra**
- **En diseño**: Permite diseñar la chimenea/horno desde cero, mejor integración arquitectónica
- **Obra en ejecución**: Requiere coordinación con construcción en curso, posibles modificaciones estructurales
- **Obra terminada**: Instalación en espacio existente, puede requerir adaptaciones más complejas

**Consideraciones del Agente**:
- En obras en diseño: sugerir mejores prácticas de diseño, ubicaciones óptimas
- En obras en ejecución: coordinar con tiempos de construcción, evitar retrasos
- En obras terminadas: evaluar viabilidad estructural, posibles modificaciones necesarias

#### **Tipo de Instalación (Interior/Exterior)**
- **Interior**: Requiere sistema de evacuación adecuado, ventilación, protecciones de seguridad
- **Exterior**: Considerar exposición a elementos, materiales resistentes, diseño apropiado

**Consideraciones del Agente**:
- Interior: verificar alturas de techo, materiales inflamables cercanos, sistemas de escape
- Exterior: considerar clima local, materiales resistentes, diseño estético integrado

#### **Altura del Techo**
Campo crítico que determina:
- Tipo de chimenea/horno adecuado
- Longitud del sistema de escape necesario
- Estética y proporciones
- Cumplimiento de códigos de construcción locales

**Consideraciones del Agente**:
- Techos bajos (< 2.5m): Chimeneas/hornos compactos, sistemas de escape cortos
- Techos medios (2.5-3.5m): Mayor flexibilidad de diseño
- Techos altos (> 3.5m): Chimeneas/hornos más grandes, sistemas de escape más largos, mejor ventilación

#### **Material del Techo**
Determina:
- Método de instalación del sistema de escape
- Necesidad de refuerzos estructurales
- Tipo de anclajes requeridos
- Códigos de seguridad específicos

**Materiales comunes**:
- **Concreto**: Requiere taladros especiales, anclajes expansivos, puede necesitar refuerzo
- **Ladrillo**: Similar a concreto, evaluación de estructura portante
- **Madera**: Requiere protección contra calor, aislantes, mayor distancia de seguridad
- **Yeso/Drywall**: Evaluar estructura portante, puede requerir refuerzo
- **Tejas/Metálico**: Considerar penetración del techo, sellado adecuado, resistencia estructural

**Consideraciones del Agente**:
- Materiales combustibles (madera, yeso): Requieren mayor distancia de seguridad, protección adicional
- Materiales no combustibles (concreto, ladrillo): Más flexibilidad, pero evaluar estructura
- Cada material requiere diferentes técnicas de instalación y cumplimiento de códigos

#### **Descripción del Proyecto**
El usuario proporciona detalles adicionales sobre:
- Requerimientos específicos
- Dimensiones deseadas
- Estilo preferido
- Uso previsto (calefacción, cocción, decoración)
- Restricciones del espacio
- Presupuesto aproximado

**Consideraciones del Agente**:
- Analizar todos los detalles técnicos mencionados arriba
- Hacer recomendaciones basadas en la combinación de factores (altura + material + tipo de instalación + estado de obra)
- Considerar seguridad, eficiencia, estética, y presupuesto

### 3. Herramienta de Dibujo Técnico

Los usuarios pueden crear dibujos técnicos e ilustraciones de su proyecto usando la herramienta de dibujo integrada. Los dibujos pueden ser exportados como imágenes PNG.

**Consideraciones del Agente**:
- Si el usuario menciona un dibujo, preguntar si lo incluyó en el formulario
- Los dibujos ayudan a entender mejor los requerimientos espaciales y de diseño
- Recomendar que incluyan dibujos para proyectos complejos

## Validaciones y Requisitos

El agente debe asegurarse de que:

1. **Todos los campos están completos** antes de procesar una solicitud
2. **Los datos técnicos son coherentes** (ej: altura de techo razonable, material del techo apropiado)
3. **Se han considerado todas las implicaciones** de la combinación de factores técnicos
4. **Las recomendaciones son apropiadas** para el estado de la obra y tipo de instalación

## Formato del Mensaje de Email

El formulario genera un mensaje estructurado con:

```
INFORMACIÓN DE CONTACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Nombre, Teléfono, Ubicación]

DETALLES DEL PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Estado obra, Altura techo, Material techo, Tipo instalación]

DESCRIPCIÓN DEL PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Descripción detallada]
```

## Recomendaciones para el Agente

1. **Priorizar la seguridad**: Siempre considerar las implicaciones de seguridad basadas en material del techo y tipo de instalación
2. **Considerar el estado de la obra**: Ajustar recomendaciones según si la obra está en diseño, ejecución, o terminada
3. **Evaluar viabilidad técnica**: Combinar altura del techo, material, y tipo de instalación para determinar viabilidad
4. **Ser específico**: Hacer recomendaciones concretas basadas en los datos técnicos proporcionados
5. **Preguntar por detalles faltantes**: Si algún dato técnico no está claro, solicitar aclaración antes de hacer recomendaciones finales

## Ejemplo de Análisis del Agente

**Caso de Uso**: Usuario con:
- Estado obra: Terminada
- Tipo instalación: Interior
- Altura techo: 2.3 metros
- Material techo: Madera

**Consideraciones del Agente**:
1. Obra terminada → Instalación puede requerir modificaciones estructurales
2. Interior → Necesita sistema de escape adecuado, verificar ventilación
3. Techo bajo (2.3m) → Chimenea/horno compacto recomendado
4. Material combustible (madera) → Mayor distancia de seguridad, protección contra calor, aislamiento adicional necesario

**Recomendación**: Proponer chimenea compacta con sistema de escape reforzado, protección adicional para techo de madera, y evaluación de estructura portante antes de instalación.

