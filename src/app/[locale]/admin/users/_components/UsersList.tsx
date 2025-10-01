'use client';

import { useState } from 'react';
import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pages, Routes, UserRole } from "@/constants/enums";
import { Edit, User, Mail, Phone, MapPin, Calendar, Shield, UserCheck, Crown } from "lucide-react";
import DeleteUserButton from "./DeleteUserButton";
import UserSearchFilter from "./UserSearchFilter";
import { User as UserType } from "@prisma/client";
import { getRoleDisplayName, getRoleColor, canEditUser } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { Translations } from "@/types/translations";

interface UsersListProps {
    users: UserType[];
    locale: string;
    translations: Translations;
}

export default function UsersList({ users, locale, translations }: UsersListProps) {
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users);
    const { data: session } = useSession();
    const currentUserRole = session?.user?.role as UserRole;

    // فصل المستخدمين حسب النوع
    const superAdminUsers = filteredUsers.filter(user => user.role === UserRole.SUPER_ADMIN);
    const adminUsers = filteredUsers.filter(user => user.role === UserRole.ADMIN);
    const regularUsers = filteredUsers.filter(user => user.role === UserRole.USER);

    return (
        <>
            {/* مكون البحث والتصفية */}
            <UserSearchFilter 
                users={users} 
                onFilteredUsers={setFilteredUsers}
                translations={translations}
            />

            {/* المديرين العامين */}
            {superAdminUsers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Crown className="h-5 w-5 text-purple-600" />
                        {translations.admin.users.list.sections.superAdmins.replace('{count}', superAdminUsers.length.toString())}
                    </h2>
                    <div className="grid gap-4">
                        {superAdminUsers.map((user) => (
                            <Card key={user.id} className="border-purple-200 bg-purple-50">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                <Badge className={`flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                                    <Crown className="h-3 w-3" />
                                                    {getRoleDisplayName(user.role)}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                )}
                                                {user.streetAddress && (
                                                    <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{user.streetAddress}, {user.city}, {user.country}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{translations.admin.users.list.joinedAt.replace('{date}', new Date(user.createdAt).toLocaleDateString())}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {canEditUser(currentUserRole, user.role) && (
                                                <Link
                                                    href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`}
                                                    className={buttonVariants({ variant: "outline", size: "sm" })}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            <DeleteUserButton userId={user.id} targetUserRole={user.role} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* المديرين */}
            {adminUsers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        {translations.admin.users.list.sections.admins.replace('{count}', adminUsers.length.toString())}
                    </h2>
                    <div className="grid gap-4">
                        {adminUsers.map((user) => (
                            <Card key={user.id} className="border-red-200 bg-red-50">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                <Badge className={`flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                                    <Shield className="h-3 w-3" />
                                                    {getRoleDisplayName(user.role)}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                )}
                                                {user.streetAddress && (
                                                    <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{user.streetAddress}, {user.city}, {user.country}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{translations.admin.users.list.joinedAt.replace('{date}', new Date(user.createdAt).toLocaleDateString())}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {canEditUser(currentUserRole, user.role) && (
                                                <Link
                                                    href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`}
                                                    className={buttonVariants({ variant: "outline", size: "sm" })}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            <DeleteUserButton userId={user.id} targetUserRole={user.role} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* المستخدمين العاديين */}
            {regularUsers.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-green-600" />
                        {translations.admin.users.list.sections.regular.replace('{count}', regularUsers.length.toString())}
                    </h2>
                    <div className="grid gap-4">
                        {regularUsers.map((user) => (
                            <Card key={user.id} className="border-green-200 bg-green-50">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                <Badge className={`flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                                    <User className="h-3 w-3" />
                                                    {getRoleDisplayName(user.role)}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                )}
                                                {user.streetAddress && (
                                                    <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{user.streetAddress}, {user.city}, {user.country}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{translations.admin.users.list.joinedAt.replace('{date}', new Date(user.createdAt).toLocaleDateString())}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {canEditUser(currentUserRole, user.role) && (
                                                <Link
                                                    href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`}
                                                    className={buttonVariants({ variant: "outline", size: "sm" })}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            <DeleteUserButton userId={user.id} targetUserRole={user.role} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {filteredUsers.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.admin.users.list.noResults.title}</h3>
                        <p className="text-gray-600">{translations.admin.users.list.noResults.description}</p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

