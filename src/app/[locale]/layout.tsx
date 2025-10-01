import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ReduxProvider from "./providers/ReduxProvider";
import { Directions, Languages } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "./providers/NextAuthSessionProvider";

export async function generateStaticParams() {
  return [{
    locale: Languages.ARABIC
  }, {
    locale: Languages.ENGLISH
  }]
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  preload: true
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  const siteName = "PizzaShop";
  const title = {
    default: siteName,
    template: `%s | ${siteName}`,
  } as Metadata['title'];
  const description = locale === Languages.ARABIC
    ? "اطلب البيتزا المفضلة لديك بسرعة وسهولة. توصيل سريع ومكونات طازجة."
    : "Order your favorite pizza fast and easy. Fresh ingredients and quick delivery.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const metadataBase = new URL(baseUrl);

  const alternates: Metadata['alternates'] = {
    canonical: `/${locale}`,
    languages: {
      en: "/en",
      ar: "/ar",
    },
  };

  return {
    metadataBase,
    title,
    description,
    applicationName: siteName,
    alternates,
    openGraph: {
      url: `/${locale}`,
      siteName,
      title: siteName,
      description,
      type: "website",
      locale,
      images: [
        {
          url: "/assets/images/logo.png",
          width: 1200,
          height: 630,
          alt: locale === Languages.ARABIC ? "شعار PizzaShop" : "PizzaShop Cover",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [
        "/assets/images/logo.png",
      ],
    },
    icons: {
      icon: "/favicon.ico",
    },
  } satisfies Metadata;
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ locale: Locale }>
}>) {
  const locale = (await params).locale;
  return (
    <html lang={locale}
    dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}
    suppressHydrationWarning
    >
      <body
       className={
        locale === Languages.ARABIC ? cairo.className : roboto.className
      }
      >
        <NextAuthSessionProvider>
        <ReduxProvider>
        <Header />
        {children}
        <Footer />
        <Toaster />
        </ReduxProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
