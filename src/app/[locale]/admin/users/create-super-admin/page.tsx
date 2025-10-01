import { Locale } from "@/i18n.config";
import CreateSuperAdminForm from "./_components/CreateSuperAdminForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { requireSuperAdminAccess } from "@/lib/auth-guards";

export default async function CreateSuperAdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  
  // التحقق من أن المستخدم مدير عام
  const session = await getServerSession(authOptions);
  requireSuperAdminAccess(session?.user?.role, locale);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إنشاء مدير عام جديد
        </h1>
        <p className="text-gray-600">
          يمكن للمدير العام إدارة جميع المستخدمين والمديرين في النظام
        </p>
      </div>

      <CreateSuperAdminForm />
    </div>
  );
}
