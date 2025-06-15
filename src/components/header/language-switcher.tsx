"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Languages } from "@/constants/enums";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();

  const switchLanguage = (newLocale: string) => {
    const path =
      pathname?.replace(`/${locale}`, `/${newLocale}`) ?? `/${newLocale}`;
    router.push(path);
  };

  return (
    <div className="flex">
      {locale === Languages.ARABIC ? (
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => switchLanguage(Languages.ENGLISH)}
        >
          EN
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => switchLanguage(Languages.ARABIC)}
        >
          AR
        </Button>
      )}
    </div>
  );
};

export default LanguageSwitcher;