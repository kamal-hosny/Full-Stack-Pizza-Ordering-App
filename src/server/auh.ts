import { Environments, Pages, Routes } from "@/constants/enums";
import { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { login } from "./_actions/auth";
import { Locale } from "@/i18n.config";
import { User, UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";

// ⬇️ نضيف حقول إضافية للـ Session الافتراضية من NextAuth
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User; // هيبقى عندنا كل بيانات المستخدم من جدول User
  }
}

// ⬇️ نضيف حقول إضافية للـ JWT (اللي بيتخزن في الكوكيز)
declare module "next-auth/jwt" {
  interface JWT extends Partial<User> {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}

// ⬇️ إعدادات NextAuth الرئيسية
export const authOptions: NextAuthOptions = {
  callbacks: {
    // ⬇️ ده بيتنادى كل مرة session بيتعملها fetch
    session: ({ session, token }) => {
      if (token) {
        // ننقل كل بيانات المستخدم من الـ JWT إلى session.user
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image as string;
        session.user.country = token.country as string;
        session.user.city = token.city as string;
        session.user.postalCode = token.postalCode as string;
        session.user.streetAddress = token.streetAddress as string;
        session.user.phone = token.phone as string;
      }

      // نرجع الـ session بعد ما ضفنا البيانات
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          image: token.image,
        },
      };
    },

    // ⬇️ ده بيتنادى كل مرة الـ JWT بيتجدد أو يتعمله إنشاء
    jwt: async ({ token }): Promise<JWT> => {
      // نجيب المستخدم من الداتابيز حسب الايميل
      const dbUser = await db.user.findUnique({
        where: {
          email: token?.email,
        },
      });

      // لو المستخدم مش موجود في الداتابيز نرجع التوكن زي ماهو
      if (!dbUser) {
        return token;
      }

      // لو موجود، نرجع بياناته ونخزنها في التوكن
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        image: dbUser.image,
        city: dbUser.city,
        country: dbUser.country,
        phone: dbUser.phone,
        postalCode: dbUser.postalCode,
        streetAddress: dbUser.streetAddress,
      };
    },
  },

  // ⬇️ إعدادات الـ session
  session: {
    strategy: "jwt", // نخزن السيشن في JWT مش في الداتابيز
    maxAge: 7 * 24 * 60 * 60, // الصلاحية 7 أيام
    updateAge: 24 * 60 * 60, // يتجدد كل 24 ساعة
  },

  // ⬇️ السر المستخدم لتوقيع JWT
  secret: process.env.NEXTAUTH_SECRET,

  // ⬇️ لو احنا في بيئة التطوير نفعل الـ debug
  debug: process.env.NODE_ENV === Environments.DEV,

  // ⬇️ مزودين تسجيل الدخول
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      // ⬇️ لما المستخدم يحاول يسجل الدخول
      authorize: async (credentials, req) => {
        // نجيب اللغة (locale) من الرابط الحالي
        const currentUrl = req?.headers?.referer;
        const locale = currentUrl?.split("/")[3] as Locale;

        // نستدعي دالة تسجيل الدخول الخاصة بينا
        const res = await login(credentials, locale);

        // لو نجاح، نرجع بيانات المستخدم
        if (res.status === 200 && res.user) {
          return res.user;
        } else {
          // لو فشل، نرمي error فيه تفاصيل الخطأ
          throw new Error(
            JSON.stringify({
              validationError: res.error,
              responseError: res.message,
            })
          );
        }
      },
    }),
  ],

  // ⬇️ نربط NextAuth مع Prisma عشان نخزن/نجيب المستخدمين من الداتابيز
  adapter: PrismaAdapter(db),

  // ⬇️ نحدد صفحة تسجيل الدخول المخصصة
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
};
