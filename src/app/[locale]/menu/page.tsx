import Menu from "@/components/menu";
import { getProductsByCategory } from "@/server/db/products";
import getTrans from "@/lib/translation";
import { Locale } from "@/i18n.config";

const MenuPage = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale } = await params;
  const t = await getTrans(locale);
  const categorites = await getProductsByCategory();

  return (
    <main className="bg-gradient-to-b from-amber-50 to-white">
      {categorites.length > 0 ? (
        categorites.map((category) => (
          <section key={category.id} className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-2">
                  <span className="text-amber-600">🍕</span> {category.name}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-red-600 mx-auto rounded-full"></div>
              </div>
              <Menu items={category.products} translations={t.menuItem} />
            </div>
          </section>
        ))
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-yellow-50 rounded-2xl p-10 text-center max-w-md border-2 border-dashed border-yellow-300">
            <p className="text-2xl font-bold text-yellow-700 mb-4">No Pizza Categories Found!</p>
            <p className="text-yellow-600">Check back later for our delicious pizzas</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default MenuPage;