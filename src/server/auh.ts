import { Environments, Pages, Routes } from "@/constants/enums";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { login } from "./_actions/auth";
import { Locale } from "@/i18n.config";

export const authOptions: NextAuthOptions = {
  session:{
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 day  
    updateAge: 60 * 60 * 24, // 24 hour
},
secret: process.env.NEXTAUTH_SECRET,
debug: process.env.NODE_ENV === Environments.DEV,
    providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async(credentials, req) => {
        const currentUrl = req?.headers?.referer
        const locale = currentUrl?.split("/")[3] as Locale; // Assuming the locale is part of the URL path
        const res = await login(credentials, locale);
        if (res.status == 200 && res.user) {
          return res.user;
        } else {
          throw new Error(JSON.stringify({ValiditionError: res.error, responseError: res.message}));
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  }
};
