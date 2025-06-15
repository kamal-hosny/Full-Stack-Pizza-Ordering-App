import React from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import Navbar from "./Navbar";
import CartButton from "./cart-button";
import getTrans from "@/lib/translation";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import LanguageSwitcher from "./language-switcher";

const Header = async () => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md py-4 transition-all duration-300">
      <div className="container flex items-center justify-between">
        {/* Logo with pizza icon */}
        <Link 
          href={Routes.ROOT} 
          className="flex items-center gap-2 group"
        >
          <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors">
            Pizza<span className="text-black">Shop</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Navbar translations={translations} />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;