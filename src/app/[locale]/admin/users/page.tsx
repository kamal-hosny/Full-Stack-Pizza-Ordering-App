import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pages, Routes, UserRole } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getUsers } from "@/server/db/users";
import { Edit, User, Mail, Phone, MapPin, Calendar, Shield, UserCheck, AlertTriangle } from "lucide-react";
import DeleteUserButton from "./_components/DeleteUserButton";
import UserSearchFilter from "./_components/UserSearchFilter";
import UsersList from "./_components/UsersList";
import { formatCurrency } from "@/lib/formatters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { User as UserType } from "@prisma/client";

async function UsersPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    
    // التحقق من أن المستخدم مدير
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
        redirect(`/${locale}/profile`);
    }
    
    const users = await getUsers();

    // فصل المستخدمين حسب النوع للإحصائيات
    const adminUsers = users?.filter(user => user.role === UserRole.ADMIN) || [];
    const regularUsers = users?.filter(user => user.role === UserRole.USER) || [];

    return (
        <main>
            <section className="section-gap">
                <div className="container">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
                        <p className="text-gray-600">عرض وإدارة جميع المستخدمين في النظام</p>
                    </div>

                    {/* إحصائيات سريعة */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                                        <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                                    </div>
                                    <User className="h-8 w-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">المديرين</p>
                                        <p className="text-2xl font-bold text-red-600">{adminUsers.length}</p>
                                    </div>
                                    <Shield className="h-8 w-8 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">المستخدمين العاديين</p>
                                        <p className="text-2xl font-bold text-green-600">{regularUsers.length}</p>
                                    </div>
                                    <UserCheck className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* قائمة المستخدمين مع البحث والتصفية */}
                    <UsersList users={users || []} locale={locale} />

                    {(!users || users.length === 0) && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد مستخدمين</h3>
                                <p className="text-gray-600">لم يتم العثور على أي مستخدمين في النظام</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* تحذير أمني */}
                    <Card className="mt-8 border-amber-200 bg-amber-50">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-800 mb-1">تنبيه أمني</h4>
                                    <p className="text-sm text-amber-700">
                                        هذه الصفحة تحتوي على معلومات حساسة للمستخدمين. تأكد من عدم مشاركة هذه البيانات مع أشخاص غير مخولين.
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
