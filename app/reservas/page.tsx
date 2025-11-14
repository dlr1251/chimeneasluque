import Header from "@/components/Header";
import ReservaVisita from "@/components/ReservaVisita";
import Chatbot from "@/components/Chatbot";

export default function ReservasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <ReservaVisita />
      </div>
      <Chatbot />
    </main>
  );
}

