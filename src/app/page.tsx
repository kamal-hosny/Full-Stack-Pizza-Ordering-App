import Hero from "./_components/Hero";
import BestSellers from "./_components/BestSellers";
import { db } from "@/lib/prisma";
import About from "@/components/about";

export default async function Home() {
  // const bestSellers = await db.size.createMany({

  // })
  return (
    <main>
      <Hero />
      <BestSellers />
      <About />
    </main>
  );
}
