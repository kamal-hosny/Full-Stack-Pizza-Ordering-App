"use server";

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { canDeleteUser } from "@/lib/permissions";

export const deleteUser = async (id: string) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  
  try {
    // التحقق من الصلاحيات
    const session = await getServerSession(authOptions);
    if (!session?.user?.role) {
      return {
        status: 401,
        message: locale === "ar" ? "غير مخول للوصول" : "Unauthorized access",
      };
    }

    // الحصول على بيانات المستخدم المراد حذفه
    const targetUser = await db.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return {
        status: 404,
        message: locale === "ar" ? "المستخدم غير موجود" : "User not found",
      };
    }

    // التحقق من الصلاحية
    if (!canDeleteUser(session.user.role as UserRole, targetUser.role)) {
      return {
        status: 403,
        message: locale === "ar" ? "ليس لديك صلاحية لحذف هذا المستخدم" : "You do not have permission to delete this user",
      };
    }

    await db.user.delete({
      where: { id },
    });
    
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${id}/${Pages.EDIT}`
    );
    
    return {
      status: 200,
      message: translations.messages.deleteUserSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};
