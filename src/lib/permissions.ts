import { UserRole } from '@prisma/client';

export interface PermissionCheck {
  canManageUsers: boolean;
  canManageAdmins: boolean;
  canEditAdminData: boolean;
  canDeleteAdmin: boolean;
  canEditUserData: boolean;
  canDeleteUser: boolean;
  canManageProducts: boolean;
  canManageCategories: boolean;
  canManageOrders: boolean;
}

/**
 * يحدد الصلاحيات المتاحة لكل رتبة
 */
export function getUserPermissions(userRole: UserRole): PermissionCheck {
  switch (userRole) {
    case UserRole.SUPER_ADMIN:
      return {
        canManageUsers: true,
        canManageAdmins: true,
        canEditAdminData: true,
        canDeleteAdmin: true,
        canEditUserData: true,
        canDeleteUser: true,
        canManageProducts: true,
        canManageCategories: true,
        canManageOrders: true,
      };
    
    case UserRole.ADMIN:
      return {
        canManageUsers: true,
        canManageAdmins: false, // لا يمكنه إدارة Admins آخرين
        canEditAdminData: false, // لا يمكنه تعديل بيانات Admins
        canDeleteAdmin: false, // لا يمكنه حذف Admins
        canEditUserData: true, // يمكنه تعديل بيانات المستخدمين العاديين فقط
        canDeleteUser: true, // يمكنه حذف المستخدمين العاديين فقط
        canManageProducts: true,
        canManageCategories: true,
        canManageOrders: true,
      };
    
    case UserRole.USER:
    default:
      return {
        canManageUsers: false,
        canManageAdmins: false,
        canEditAdminData: false,
        canDeleteAdmin: false,
        canEditUserData: false,
        canDeleteUser: false,
        canManageProducts: false,
        canManageCategories: false,
        canManageOrders: false,
      };
  }
}

/**
 * يتحقق من إمكانية تعديل مستخدم معين
 */
export function canEditUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  // const permissions = getUserPermissions(currentUserRole);
  
  // Super Admin يمكنه تعديل أي مستخدم
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Admin يمكنه تعديل المستخدمين العاديين فقط
  if (currentUserRole === UserRole.ADMIN) {
    return targetUserRole === UserRole.USER;
  }
  
  return false;
}

/**
 * يتحقق من إمكانية حذف مستخدم معين
 */
export function canDeleteUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  // const permissions = getUserPermissions(currentUserRole);
  
  // Super Admin يمكنه حذف أي مستخدم
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Admin يمكنه حذف المستخدمين العاديين فقط
  if (currentUserRole === UserRole.ADMIN) {
    return targetUserRole === UserRole.USER;
  }
  
  return false;
}

/**
 * يتحقق من إمكانية تغيير رتبة مستخدم معين
 */
export function canChangeUserRole(currentUserRole: UserRole, targetUserRole: UserRole, newRole: UserRole): boolean {
  // Super Admin يمكنه تغيير أي رتبة لأي رتبة
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Admin يمكنه رفع المستخدمين العاديين إلى Admin فقط
  if (currentUserRole === UserRole.ADMIN) {
    return targetUserRole === UserRole.USER && newRole === UserRole.ADMIN;
  }
  
  return false;
}

/**
 * يتحقق من إمكانية تعديل بيانات مستخدم معين (مع القيود المطلوبة)
 */
export function canEditUserData(currentUserRole: UserRole, targetUserRole: UserRole, hasEmptyFields: boolean = false, isOwnProfile: boolean = false): boolean {
  // المستخدم يمكنه تعديل بياناته الشخصية دائماً
  if (isOwnProfile) {
    return true;
  }
  
  // Super Admin يمكنه تعديل أي بيانات
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Admin يمكنه تعديل بيانات المستخدمين العاديين فقط
  if (currentUserRole === UserRole.ADMIN) {
    // يمكنه تعديل البيانات الفارغة فقط للمستخدمين العاديين
    return targetUserRole === UserRole.USER && hasEmptyFields;
  }
  
  return false;
}

/**
 * يحصل على اسم الرتبة باللغة العربية
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'مدير عام';
    case UserRole.ADMIN:
      return 'مدير';
    case UserRole.USER:
      return 'مستخدم عادي';
    default:
      return 'غير محدد';
  }
}

/**
 * يحصل على لون الرتبة للعرض
 */
export function getRoleColor(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case UserRole.ADMIN:
      return 'bg-red-100 text-red-800 border-red-200';
    case UserRole.USER:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
