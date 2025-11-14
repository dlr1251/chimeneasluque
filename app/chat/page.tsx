import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              Chat con nuestro Asistente Virtual
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestro asistente virtual está aquí para ayudarte con cualquier pregunta 
              sobre nuestros productos, servicios, instalación y más. 
              Estamos disponibles 24/7 para asistirte.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              ¿En qué podemos ayudarte?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Información sobre nuestros productos (chimeneas, hornos, fogatas)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Consultas sobre instalación y tiempo de entrega</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Preguntas sobre mantenimiento y garantías</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Diseños personalizados y cotizaciones</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Cualquier otra consulta relacionada con nuestros servicios</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Consejo
            </h3>
            <p className="text-blue-800">
              Si necesitas una respuesta más detallada o personalizada, no dudes en 
              contactarnos directamente a través de nuestro{" "}
              <a href="#contacto" className="underline font-semibold hover:text-blue-900">
                formulario de contacto
              </a>
              . Nuestro equipo estará encantado de ayudarte.
            </p>
          </div>

          {/* El chatbot se mostrará automáticamente en esta página */}
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                El asistente virtual aparecerá en la esquina inferior derecha
              </p>
              <p className="text-sm text-gray-500">
                Haz clic en el botón de chat para comenzar
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot flotante */}
      <Chatbot initialOpen={true} />
    </main>
  );
}

