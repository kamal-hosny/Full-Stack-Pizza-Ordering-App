import React from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import Navbar from "./Navbar";
import CartButton from "./cart-button";
import getTrans from "@/lib/translation";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import LanguageSwitcher from "./language-switcher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import AuthButtons from "./auth-buttons";

const Header = async () => {
  const locale = await getCurrentLocale();
  const initialSession = await getServerSession(authOptions);
  const translations = await getTrans(locale);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md py-4 transition-all duration-300">
      <div className="container flex items-center justify-between gap-6 lg:gap-10">
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
          <Navbar translations={translations} initialSession={initialSession} />
          <div className="flex items-center gap-4 flex-1 justify-end">

                <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
              <LanguageSwitcher />

            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;