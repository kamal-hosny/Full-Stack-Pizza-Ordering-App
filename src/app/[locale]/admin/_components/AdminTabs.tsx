"use client";

import Link from "@/components/link";
import { Pages, Routes } from "@/constants/enums";
import { Translations } from "@/types/translations";
import { useParams, usePathname } from "next/navigation";
import { FolderOpen, Package, Users, ShoppingCart, BarChart3 } from "lucide-react";

function AdminTabs({ translations }: { translations: Translations }) {
  const pathname = usePathname();
  const { locale } = useParams();

  const tabs = [
    {
      id: crypto.randomUUID(),
      title: translations.admin.tabs.profile,
      href: Routes.ADMIN,
      icon: BarChart3,
    },
    {
      id: crypto.randomUUID(),
      title: translations.admin.tabs.categories,
      href: `${Routes.ADMIN}/${Pages.CATEGORIES}`,
      icon: FolderOpen,
    },
    {
      id: crypto.randomUUID(),
      title: translations.admin.tabs.menuItems,
      href: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
      icon: Package,
    },
    {
      id: crypto.randomUUID(),
      title: translations.admin.tabs.users,
      href: `${Routes.ADMIN}/${Pages.USERS}`,
      icon: Users,
    },
    {
      id: crypto.randomUUID(),
      title: translations.admin.tabs.orders,
      href: `${Routes.ADMIN}/${Pages.ORDERS}`,
      icon: ShoppingCart,
    },
  ];
  
  const isActiveTab = (href: string) => {
    const hrefArray = href.split("/");
    return hrefArray.length > 1
      ? pathname.startsWith(`/${locale}/${href}`)
      : pathname === `/${locale}/${href}`;
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-1 py-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveTab(tab.href);
            
            return (
              <li key={tab.id}>
                <Link
                  href={`/${locale}/${tab.href}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-[#fe0019] text-white shadow-md"
                      : "text-gray-600 hover:text-[#fe0019] hover:bg-[#fe0019]/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default AdminTabs;
