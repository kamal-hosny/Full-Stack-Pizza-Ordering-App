"use server";

import { db } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createDefaultSuperAdmin() {
  try {
    const defaultEmail = "superadmin@example.com";
    
    // التحقق من وجود المستخدم
    const existingUser = await db.user.findUnique({
      where: {
        email: defaultEmail,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "المدير العام الافتراضي موجود بالفعل",
      };
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash("superadmin123", 12);

    // إنشاء المستخدم الجديد
    const newUser = await db.user.create({
      data: {
        name: "مدير عام",
        email: defaultEmail,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      },
    });

    // إعادة تحديث الصفحات
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "تم إنشاء المدير العام الافتراضي بنجاح",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Error creating default super admin:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء المدير العام الافتراضي",
    };
  }
}











