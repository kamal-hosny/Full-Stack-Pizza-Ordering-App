import Hero from "./_components/Hero";
import BestSellers from "./_components/BestSellers";
import About from "@/components/about";
import Contact from "@/components/contact";

export default async function Home() { 
  
  return (
    <main>
      <Hero />
      <BestSellers />
      <About />
      <Contact />
    </main>
  );
}
