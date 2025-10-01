import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pages, Routes, UserRole } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getUsers } from "@/server/db/users";
import getTrans from "@/lib/translation";
import { User, Shield, UserCheck, AlertTriangle, Crown, Plus } from "lucide-react";
import UsersList from "./_components/UsersList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

async function UsersPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    
    // التحقق من أن المستخدم مدير أو مدير عام
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
        redirect(`/${locale}/profile`);
    }
    
    const users = await getUsers();
    const translations = await getTrans(locale);

    // فصل المستخدمين حسب النوع للإحصائيات
    const superAdminUsers = users?.filter(user => user.role === UserRole.SUPER_ADMIN) || [];
    const adminUsers = users?.filter(user => user.role === UserRole.ADMIN) || [];
    const regularUsers = users?.filter(user => user.role === UserRole.USER) || [];

    return (
        <main>
            <section className="section-gap">
                <div className="container">
                    <div className="mb-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{translations.admin.users.page.title}</h1>
                                <p className="text-gray-600">{translations.admin.users.page.subtitle}</p>
                            </div>
                            {session.user.role === UserRole.SUPER_ADMIN && (
                                <div className="flex gap-2">
                                    <Link
                                        href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/create-super-admin`}
                                        className={`${buttonVariants({ variant: "default", size: "sm" })} bg-[#fe0019] hover:bg-[#df0016]`}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {translations.admin.users.page.cta.createSuperAdmin}
                                    </Link>
                                    <Link
                                        href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/create-default-super-admin`}
                                        className={buttonVariants({ variant: "outline", size: "sm" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {translations.admin.users.page.cta.createDefaultSuperAdmin}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* إحصائيات سريعة */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{translations.admin.users.page.stats.total}</p>
                                        <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                                    </div>
                                    <User className="h-8 w-8 text-[#fe0019]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{translations.admin.users.page.stats.superAdmins}</p>
                                        <p className="text-2xl font-bold text-purple-600">{superAdminUsers.length}</p>
                                    </div>
                                    <Crown className="h-8 w-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{translations.admin.users.page.stats.admins}</p>
                                        <p className="text-2xl font-bold text-red-600">{adminUsers.length}</p>
                                    </div>
                                    <Shield className="h-8 w-8 text-[#fe0019]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{translations.admin.users.page.stats.regular}</p>
                                        <p className="text-2xl font-bold text-green-600">{regularUsers.length}</p>
                                    </div>
                                    <UserCheck className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* قائمة المستخدمين مع البحث والتصفية */}
                    <UsersList users={users || []} locale={locale} translations={translations} />

                    {(!users || users.length === 0) && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.admin.users.page.empty.title}</h3>
                                <p className="text-gray-600">{translations.admin.users.page.empty.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* تحذير أمني */}
                    <Card className="mt-8 border-amber-200 bg-amber-50">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-800 mb-1">{translations.admin.users.page.security.title}</h4>
                                    <p className="text-sm text-amber-700">
                                        {translations.admin.users.page.security.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}

export default UsersPage;
