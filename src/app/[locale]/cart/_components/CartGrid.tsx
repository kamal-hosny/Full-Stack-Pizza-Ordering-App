"use client";

import { useAppSelector } from "@/redux/hooks";
import CartItems from "./CartItems"
import CheckoutForm from "./CheckoutForm"
import { selectCartItems } from "@/redux/features/cart/cartSlice";

const CartGrid = () => {
    const cart = useAppSelector(selectCartItems);

    const isGrid = cart && cart.length > 0
  return (
    <div className={`grid  grid-cols-1 gap-8 ${isGrid ? "lg:grid-cols-2" : "grid-cols-1" }`}>
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <CartItems />
    </div>
    { isGrid &&
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <CheckoutForm />
    </div>
    }
    
  </div>
  )
}

export default CartGrid