import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { ProductWithRelations } from "@/types/product";

const MenuItem = ({ item }: { item: ProductWithRelations }) => {
  return (
    <div className="bg-[#fdf8f2] rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] overflow-hidden border-2 border-amber-100 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 group relative">
      {/* Pizza Box Design Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-red-600"></div>
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600"></div>
      
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Popular tag as pizza slice */}
        <div className="absolute top-4 right-4 bg-white text-red-600 text-xs font-bold px-3 py-2 rounded-full shadow-lg rotate-6 flex items-center">
          <span className="mr-1">🍕</span> POPULAR
        </div>
      </div>

      <div className="p-5 bg-[#fffaf5] relative">
        {/* Pizza crust separator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-amber-300 rounded-full"></div>
        
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xl text-red-800 font-serif">{item.name}</h3>
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xl px-3 py-1 rounded-full shadow-md">
            {formatCurrency(item.basePrice)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 min-h-[60px] italic font-sans">
          {item.description}
        </p>

        <div className="mt-4 flex justify-center">
          <AddToCartButton item={item} />
        </div>
      </div>
      
      {/* Pizza box corner design */}
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-amber-300 rounded-bl-lg"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-amber-300 rounded-br-lg"></div>
    </div>
  );
};

export default MenuItem;