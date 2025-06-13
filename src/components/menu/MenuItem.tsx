import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { ProductWithRelations } from "@/types/product";

const MenuItem = ({ item }: { item: ProductWithRelations }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
          Popular
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
          <span className="text-accent font-bold text-xl">
            {formatCurrency(item.basePrise)}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4 min-h-[60px]">
          {item.description}
        </p>

        <AddToCartButton item={item} />
      </div>
    </div>
  );
};

export default MenuItem;
