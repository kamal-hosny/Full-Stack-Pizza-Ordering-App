import Hero from "./_components/Hero";
import BestSellers from "./_components/BestSellers";
import { db } from "@/lib/prisma";
import About from "@/components/about";
import { Languages } from "@/constants/enums";
import { url } from "inspector";
import { headers } from "next/headers";
import getTrans from "@/lib/translation";
import { Locale } from "@/i18n.config";

export default async function Home() { 
  const url = (await headers()).get("x-url");
  const local = url?.split("/")[3] as Locale

  return (
    <main>
      <Hero />
      <BestSellers />
      <About />
    </main>
  );
}
