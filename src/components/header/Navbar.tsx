"use client";

import { Pages, Routes } from "@/constants/enums";
import React, { useState, useEffect } from "react";
import Link from "../link";
import { Button, buttonVariants } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = ({ translations }: { translations: any }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    {
      id: crypto.randomUUID(),
      title: translations.navbar.login,
      href: `${Routes.AUTH}/${Pages.LOGIN}`,
    },
  ];

  return (
    <nav className="flex-1 justify-end flex">
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
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-8 right-8 lg:hidden bg-red-500 hover:bg-red-600 text-white rounded-full"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="w-6 h-6" />
        </Button>
        
        {links.map((link) => (
          <li key={link.id} className="w-full lg:w-auto">
            <Link
              href={`/${link.href}`}
              className={`${
                link.href === `${Routes.AUTH}/${Pages.LOGIN}`
                  ? `${buttonVariants({ size: "lg" })} bg-primary hover:bg-primary-dark text-white px-8 rounded-full font-bold`
                  : `text-lg lg:text-base font-medium ${
                      pathname.includes(link.href)
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-700 hover:text-primary"
                    } transition-colors duration-200 pb-1`
              } w-full lg:w-auto py-3 lg:py-0`}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;