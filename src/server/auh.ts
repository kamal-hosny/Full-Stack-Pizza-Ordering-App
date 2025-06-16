import { Environments } from "@/constants/enums";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";

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
      authorize: (credentials) => {
        const user = credentials;
        return {
          id: crypto.randomUUID(),
          ...user,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db)
};
