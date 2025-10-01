"use client";

import { useAppSelector } from "@/redux/hooks";
import CartItems from "./CartItems"
import CheckoutForm from "./CheckoutForm"
import { selectCartItems } from "@/redux/features/cart/cartSlice";

type CartTrans = typeof import("@/dictionaries/en.json")["cart"];

const CartGrid = ({ trans }: { trans: CartTrans }) => {
    const cart = useAppSelector(selectCartItems);

    const isGrid = cart && cart.length > 0
  return (
    <div className={`grid  grid-cols-1 gap-8 ${isGrid ? "lg:grid-cols-2" : "grid-cols-1" }`}>
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <CartItems trans={trans} />
    </div>
    { isGrid &&
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <CheckoutForm trans={trans} />
    </div>
    }
    
  </div>
  )
}

export default CartGrid