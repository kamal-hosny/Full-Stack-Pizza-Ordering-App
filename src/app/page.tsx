import Hero from "./_components/Hero";
import BestSellers from "./_components/BestSellers";
import { db } from "@/lib/prisma";

export default async function Home() {
  // const bestSellers = await db.size.createMany({
 
  // })
  return (
    <main>
      <Hero />
      <BestSellers />
    </main>
  );
}
