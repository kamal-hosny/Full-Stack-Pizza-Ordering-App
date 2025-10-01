"use client";

import Link from "@/components/link";
import { Pages, Routes } from "@/constants/enums";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Translations } from "@/types/translations";

function MenuItems({ products, translations }: { products: Product[]; translations: Translations }) {
  const { locale } = useParams();
  
  return products && products.length > 0 ? (
    <ul className="grid grid-cols-3 gap-4 sm:max-w-[625px] mx-auto">
      {products.map((product) => (
        <li
          key={product.id}
          className="bg-gray-100 hover:bg-gray-200 duration-200 transition-colors rounded-md"
        >
          <Link
            href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${product.id}/${Pages.EDIT}`}
            className="element-center flex-col py-4"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
            />
            <h3 className="text-lg text-[#fe0019] font-medium">{product.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-[#fe0019] text-center">{translations.noProductsFound}</p>
  );
}

export default MenuItems;
