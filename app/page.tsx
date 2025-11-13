import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Historia from "@/components/Historia";
import Disenos from "@/components/Disenos";
import Hornos from "@/components/Hornos";
import Chimeneas from "@/components/Chimeneas";
import Fogatas from "@/components/Fogatas";
import Contacto from "@/components/Contacto";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Historia />
      <Disenos />
      <Hornos />
      <Chimeneas />
      <Fogatas />
      <Contacto />
    </main>
  );
}

