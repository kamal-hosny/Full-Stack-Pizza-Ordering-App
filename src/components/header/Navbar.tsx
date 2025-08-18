"use client";

import { Routes } from "@/constants/enums";
import Link from "../link";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import AuthButtons from "./auth-buttons";
import LanguageSwitcher from "./language-switcher";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { UserRole } from "@prisma/client";

function Navbar({
  translations,
  initialSession,
}: {
  translations: Translations;
  initialSession: Session | null;
}) {
  const session = useClientSession(initialSession);

  const [openMenu, setOpenMenu] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();

  const links = [
    {
      id: crypto.randomUUID(),
      title: translations.navbar.menu,
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.about,
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.contact,
      href: Routes.CONTACT,
    },
  ];

  const isAdmin = session.data?.user.role === UserRole.ADMIN;

  return (
    <nav className="order-last lg:order-none">
      {/* Mobile menu button */}
      <Button
        variant="secondary"
        size="sm"
        className="lg:hidden bg-primary hover:bg-primary-dark text-white rounded-full"
        onClick={() => setOpenMenu(true)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Navigation links */}
      <ul
        className={`fixed lg:static ${
          openMenu ? "left-0 z-50" : "-left-full"
        } top-0 px-10 py-20 lg:p-0 bg-white lg:bg-transparent transition-all duration-300 h-full lg:h-auto flex flex-col lg:flex-row w-4/5 lg:w-auto items-start lg:items-center gap-8 lg:gap-10 shadow-xl lg:shadow-none`}
      >
        {/* Close button for mobile */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-8 right-8 lg:hidden bg-red-500 hover:bg-red-600 text-white rounded-full"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="w-6 h-6" />
        </Button>

        {/* Static links */}
        {links.map((link) => (
          <li key={link.id} className="w-full lg:w-auto">
            <Link
              onClick={() => setOpenMenu(false)}
              href={`/${locale}/${link.href}`}
              className={`${
                pathname.startsWith(`/${locale}/${link.href}`)
                  ? `${buttonVariants({
                      size: "lg",
                    })} bg-primary hover:bg-primary-dark text-white px-8 rounded-full font-bold`
                  : "text-lg lg:text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200 pb-1"
              } w-full lg:w-auto py-3 lg:py-0`}
            >
              {link.title}
            </Link>
          </li>
        ))}

        {/* Profile/Admin link when logged in */}
        {session.data?.user && (
          <li className="w-full lg:w-auto">
            <Link
              href={
                isAdmin
                  ? `/${locale}/${Routes.ADMIN}`
                  : `/${locale}/${Routes.PROFILE}`
              }
              onClick={() => setOpenMenu(false)}
              className={`${
                pathname.startsWith(
                  isAdmin
                    ? `/${locale}/${Routes.ADMIN}`
                    : `/${locale}/${Routes.PROFILE}`
                )
                  ? `${buttonVariants({
                      size: "lg",
                    })} bg-primary hover:bg-primary-dark text-white px-8 rounded-full font-bold`
                  : "text-lg lg:text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200 pb-1"
              } w-full lg:w-auto py-3 lg:py-0`}
            >
              {isAdmin
                ? translations.navbar.admin
                : translations.navbar.profile}
            </Link>
          </li>
        )}

        {/* Mobile only: Auth + Language */}
        <li className="lg:hidden flex flex-col gap-4">
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
          </div>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
