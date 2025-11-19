"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Bot, User, Paperclip, File, Image as ImageIcon, Trash2 } from "lucide-react";

interface AttachedFile {
  id: string;
  file: File;
  preview?: string; // Para imágenes
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: AttachedFile[];
}

interface ChatbotProps {
  onClose?: () => void;
  initialOpen?: boolean;
}

export default function Chatbot({ onClose, initialOpen = false }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Buenos días. Soy Lucio Luque de Chimeneas Luque. ¿En qué puedo ayudarle? 🔥",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Manejar selección de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      // Validar tipo de archivo (imágenes y documentos comunes)
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // Máximo 10MB
    });

    if (validFiles.length !== files.length) {
      alert('Algunos archivos no son válidos. Solo se aceptan imágenes (JPG, PNG, GIF, WebP), PDFs, documentos Word y archivos de texto. Máximo 10MB por archivo.');
    }

    // Crear previews para imágenes
    const newAttachments: AttachedFile[] = validFiles.map(file => {
      const attachment: AttachedFile = {
        id: Date.now().toString() + Math.random(),
        file: file
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachedFiles(prev => [...prev]); // Trigger re-render
        };
        reader.readAsDataURL(file);
      }

      return attachment;
    });

    setAttachedFiles(prev => [...prev, ...newAttachments]);

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remover archivo adjunto
  const removeAttachment = (id: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon size={16} className="text-blue-500" />;
    }
    return <File size={16} className="text-gray-500" />;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachedFiles([]); // Limpiar archivos adjuntos después de enviar
    setIsLoading(true);

    try {
      // Construir historial de conversación para la API
      const conversationHistory = messages
        .filter((msg) => msg.role !== "assistant" || msg.id !== "1") // Excluir mensaje inicial
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      let response;

      // Si hay archivos adjuntos, usar FormData
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        const formData = new FormData();
        formData.append('message', userMessage.content);
        formData.append('conversationHistory', JSON.stringify(conversationHistory));

        userMessage.attachments.forEach((attachment, index) => {
          formData.append(`file_${index}`, attachment.file);
        });
        formData.append('fileCount', userMessage.attachments.length.toString());

        response = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        });
      } else {
        // Si no hay archivos, usar JSON normal
        response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationHistory: conversationHistory,
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "Lo siento, no pude procesar tu mensaje.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Log debug info si está disponible
        if (data.debug) {
          console.log('[Chatbot] Debug info:', data.debug);
        }
      } else {
        // Log detallado del error
        console.error('[Chatbot] API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: '/api/chat'
        });
        
        // Si la API devuelve un mensaje, usarlo; de lo contrario, usar el error genérico
        let errorContent = data.message || data.error || "Error al enviar mensaje";
        
        // Si hay información de debug, loguearla (solo en consola, no en mensaje al usuario)
        if (data.debug) {
          console.error('[Chatbot] Debug details:', data.debug);
        }
        
        throw new Error(errorContent);
      }
    } catch (error) {
      console.error("[Chatbot] Error sending message:", error);
      
      // Mostrar el mensaje de error específico si está disponible
      let errorContent = "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo o contacta con nosotros directamente a través del formulario de contacto.";
      
      if (error instanceof Error) {
        errorContent = error.message || errorContent;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && onClose) {
      // Si se está abriendo, no llamar a onClose
    } else if (isOpen && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-accent-500 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          aria-label="Abrir chat"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <h3 className="font-semibold">Asistente Virtual</h3>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && (
                      <Bot size={16} className="mt-0.5 flex-shrink-0" />
                    )}
                    {message.role === "user" && (
                      <User size={16} className="mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                              {attachment.preview ? (
                                <img
                                  src={attachment.preview}
                                  alt={attachment.file.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              ) : (
                                getFileIcon(attachment.file)
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {attachment.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(attachment.file.size)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Archivos adjuntos */}
          {attachedFiles.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2">
                {attachedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-6 h-6 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.file)
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(file.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Remover archivo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              {/* Input oculto para archivos */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Botón adjuntar archivos */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Adjuntar archivos"
                title="Adjuntar imágenes o documentos"
              >
                <Paperclip size={20} />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={attachedFiles.length > 0 ? "Agregar mensaje opcional..." : "Escribe tu mensaje..."}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                className="bg-primary text-white p-2 rounded-lg hover:bg-accent-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Enviar mensaje"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by xAI Grok • Adjunta imágenes o documentos para análisis
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

