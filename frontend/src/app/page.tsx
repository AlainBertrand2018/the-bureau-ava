import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Credibility from '@/components/Credibility';
import CTA from '@/components/CTA';
import Services from '@/components/Services';
import Intelligence from '@/components/Intelligence';
import Footer from '@/components/Footer';
import SimulationResults from '@/components/SimulationResults';

export default function Home() {
  // Mock data for previewing the component
  const mockSimulationData = [
    { Agent: "Jean-Pierre", Demographic: "45/Curepipe", Q1: "I like it." },
    { Agent: "Sarah", Demographic: "22/Moka", Q1: "Too expensive." },
    { Agent: "Lokesh", Demographic: "35/Port Louis", Q1: "Needs local spice." },
    { Agent: "Ameen", Demographic: "28/Grand Baie", Q1: "Amazing idea!" },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <CTA />
      <Credibility />
      <Services />
      <Intelligence />
      <Footer />
    </main>
  );
}
