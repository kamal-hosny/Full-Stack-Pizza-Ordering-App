// Menu.tsx
import MenuItem from "./MenuItem";
import { ProductWithRelations } from "@/types/product";

type MenuTranslations = typeof import("@/dictionaries/en.json")["menuItem"];

const Menu = ({ items, translations }: { items: ProductWithRelations[]; translations: MenuTranslations }) => {
  return items.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map((item: ProductWithRelations) => (
        <MenuItem key={item.id} item={item} translations={translations} />
      ))}
    </div>
  ) : (
    <div className="bg-yellow-50 rounded-xl p-8 text-center border-2 border-dashed border-yellow-200">
      <p className="text-xl font-bold text-yellow-700">No pizzas found!</p>
      <p className="text-yellow-600 mt-2">Try another category</p>
    </div>
  )
};

export default Menu;