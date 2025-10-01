import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getBestSellers } from "@/server/db/products";

type MenuTranslations = typeof import("@/dictionaries/en.json")["menuItem"];

const BestSellers = async ({ subTitle, title, menuTranslations }: { subTitle: string; title: string; menuTranslations: MenuTranslations }) => {
  const bestSellers = await getBestSellers(3)
  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <MainHeading subTitle={subTitle} title={title} />
        </div>
        <Menu items={bestSellers} translations={menuTranslations} />
      </div>
    </section>
  );
};

export default BestSellers;
