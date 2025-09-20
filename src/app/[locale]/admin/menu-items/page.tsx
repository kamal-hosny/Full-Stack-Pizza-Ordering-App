import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { getProducts } from "@/server/db/products";
import { UserRole } from "@prisma/client";
import { ArrowRightCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MenuItems from "./_components/MenuItems";

async function MenuItemsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const locale = (await params).locale;
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  const products = await getProducts();

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
            <p className="text-gray-600 mt-2">عرض وإدارة جميع منتجات القائمة</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
            <Link
              href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
              className={`${buttonVariants({
                variant: "default",
              })} flex items-center gap-2 px-6 py-3`}
            >
              {translations.admin["menu-items"].createNewMenuItem}
              <ArrowRightCircle
                className={`w-5 h-5 ${
                  locale === Languages.ARABIC ? "rotate-180" : ""
                }`}
              />
            </Link>
          </div>
        </div>
      </div>
      <MenuItems products={products} />
    </div>
  );
}

export default MenuItemsPage;
