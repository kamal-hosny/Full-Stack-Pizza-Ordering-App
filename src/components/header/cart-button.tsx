"use client";

import { Routes } from "@/constants/enums";
import { getCartQuantity } from "@/lib/cart";
import { selectCartItems } from "@/redux/features/cart/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CartButton = () => {
  const cart = useAppSelector(selectCartItems);
  const cartQuantity = getCartQuantity(cart);
  const { locale } = useParams();
  
  return (
    <Link 
      href={`/${locale}/${Routes.CART}`} 
      className="block relative group p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <span className="absolute top-0 right-0 w-5 h-5 text-xs bg-red-500 rounded-full text-white flex items-center justify-center font-bold shadow-md">
        {cartQuantity}
      </span>
      <ShoppingCartIcon
        className={`text-primary group-hover:text-primary-dark duration-200 transition-colors w-6 h-6`}
      />
    </Link>
  );
};

export default CartButton;