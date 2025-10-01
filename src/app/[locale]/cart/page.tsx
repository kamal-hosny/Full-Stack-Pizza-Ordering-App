import React from "react";
import { ShoppingCart } from "lucide-react";
import CartGrid from "./_components/CartGrid";
import getTrans from "@/lib/translation";
import { getCurrentLocale } from "@/lib/getCurrentLocale";

const CartPage = async () => {
  const locale = await getCurrentLocale();
  const trans = await getTrans(locale);
  return (
    <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10">
      <section className="section-gap">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center gap-3 mb-10">
            <ShoppingCart className="text-primary text-4xl" />
            <h1 className="text-primary text-center font-bold text-4xl italic">
              {trans.cart.title}
            </h1>
          </div>
          
         <CartGrid trans={trans.cart} />
          
      <div className="mt-12 text-center text-gray-600 max-w-2xl mx-auto">
        <p className="flex items-center justify-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          {trans.cart.badges.secure}
        </p>
        <p className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {trans.cart.badges.moneyBack}
        </p>
      </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;