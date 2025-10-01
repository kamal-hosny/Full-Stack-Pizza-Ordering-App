"use server";

import { db } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

interface CreateSuperAdminData {
  name: string;
  email: string;
  password: string;
}

export async function createSuperAdmin(data: CreateSuperAdminData) {
  try {
    // التحقق من وجود المستخدم
    const existingUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "المستخدم موجود بالفعل بهذا البريد الإلكتروني",
      };
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // إنشاء المستخدم الجديد
    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      },
    });

    // إعادة تحديث الصفحات
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "تم إنشاء المدير العام بنجاح",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Error creating super admin:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء المدير العام",
    };
  }
}

