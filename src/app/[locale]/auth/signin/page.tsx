import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";

const  SigninPage = async () => {
  const locale = await getCurrentLocale()
  return (
    <main>
      <div className="py-44 md:py-40 bg-gray-50 element-center">
        <div className="container element-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              welcome Back
            </h2>
            <form action="">
     form
            </form>
            <p className="mt-2 flex items-center justify-center text-accent text-sm">
                <span>Don&apos;t have an account?</span>
                <Link
                  href={`/${locale}/${Routes.AUTH}/${Pages.Register}`}
                  className={`${buttonVariants({
                    variant: "link",
                    size: "sm",
                  })} !text-black`}
                >
                  Sign Up
                </Link>
              </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
