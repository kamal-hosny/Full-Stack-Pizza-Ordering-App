import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n.config';

/**
 * يتحقق من صلاحية الوصول للصفحات الإدارية
 */
export function requireAdminAccess(userRole: UserRole | undefined, locale: Locale) {
  if (!userRole || (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN)) {
    redirect(`/${locale}/profile`);
  }
}

/**
 * يتحقق من صلاحية الوصول للصفحات التي تتطلب Super Admin
 */
export function requireSuperAdminAccess(userRole: UserRole | undefined, locale: Locale) {
  if (!userRole || userRole !== UserRole.SUPER_ADMIN) {
    redirect(`/${locale}/profile`);
  }
}

/**
 * يتحقق من صلاحية الوصول للصفحات العامة (مستخدمين عاديين أو أعلى)
 */
export function requireUserAccess(userRole: UserRole | undefined, locale: Locale) {
  if (!userRole) {
    redirect(`/${locale}/auth/signin`);
  }
}

/**
 * يتحقق من صلاحية تعديل مستخدم معين
 */
export function requireUserEditAccess(
  currentUserRole: UserRole | undefined,
  targetUserRole: UserRole | undefined,
  locale: Locale,
  isOwnProfile: boolean = false
) {
  if (!currentUserRole) {
    redirect(`/${locale}/auth/signin`);
  }

  // المستخدم يمكنه تعديل بياناته الشخصية دائماً
  if (isOwnProfile) {
    return true;
  }

  // Super Admin يمكنه تعديل أي مستخدم
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin يمكنه تعديل المستخدمين العاديين فقط
  if (currentUserRole === UserRole.ADMIN && targetUserRole === UserRole.USER) {
    return true;
  }

  redirect(`/${locale}/profile`);
}

/**
 * يتحقق من صلاحية حذف مستخدم معين
 */
export function requireUserDeleteAccess(
  currentUserRole: UserRole | undefined,
  targetUserRole: UserRole | undefined,
  locale: Locale
) {
  if (!currentUserRole) {
    redirect(`/${locale}/auth/signin`);
  }

  // Super Admin يمكنه حذف أي مستخدم
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin يمكنه حذف المستخدمين العاديين فقط
  if (currentUserRole === UserRole.ADMIN && targetUserRole === UserRole.USER) {
    return true;
  }

  redirect(`/${locale}/profile`);
}

/**
 * يتحقق من صلاحية تغيير رتبة مستخدم
 */
export function requireRoleChangeAccess(
  currentUserRole: UserRole | undefined,
  targetUserRole: UserRole | undefined,
  newRole: UserRole,
  locale: Locale
) {
  if (!currentUserRole) {
    redirect(`/${locale}/auth/signin`);
  }

  // Super Admin يمكنه تغيير أي رتبة
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin يمكنه رفع المستخدمين العاديين إلى Admin فقط
  if (
    currentUserRole === UserRole.ADMIN &&
    targetUserRole === UserRole.USER &&
    newRole === UserRole.ADMIN
  ) {
    return true;
  }

  redirect(`/${locale}/profile`);
}
