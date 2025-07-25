import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import Form from "./_components/Form";

const SignupPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = (await params)
  const translations = await getTrans(locale);
  return (
    <main>
      <div className="py-44 md:py-40 bg-gray-50 element-center">
        <div className="container element-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
                {translations.auth.register.title}
            </h2>
            <form action="">
            <Form translations={translations} />
            </form>
            <p className="mt-2 flex items-center justify-center text-accent text-sm">
                <span>{translations.auth.register.authPrompt.message}</span>
                <Link
                  href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}
                  className={`${buttonVariants({
                    variant: "link",
                    size: "sm",
                  })} !text-black`}
                >
                  {translations.auth.register.authPrompt.loginLinkText}
                </Link>
              </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
