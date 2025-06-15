// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Ensure i18n.config.ts exists and is properly configured
import { LanguageType, i18n } from "./i18n.config";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Install required dependencies:
// npm install next @formatjs/intl-localematcher negotiator

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: LanguageType[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  let locale = i18n.defaultLocale;

  try {
    locale = match(languages, locales, i18n.defaultLocale);
  } catch (error) {
    console.error("Error matching locale:", error);
    locale = i18n.defaultLocale;
  }
  return locale;
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};