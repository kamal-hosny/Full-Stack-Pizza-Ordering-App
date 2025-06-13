import MenuItem from "./MenuItem";
import { ProductWithRelations } from "@/types/product";

const Menu = ({ items }: { items: ProductWithRelations[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item: ProductWithRelations) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Menu;
