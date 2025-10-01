'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Users, Shield } from 'lucide-react';
import { UserRole } from '@/constants/enums';
import { User as PrismaUser } from '@prisma/client';
import { Translations } from '@/types/translations';

interface UserSearchFilterProps {
    users: PrismaUser[];
    onFilteredUsers: (users: PrismaUser[]) => void;
    translations?: Translations;
}

export default function UserSearchFilter({ users, onFilteredUsers, translations }: UserSearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSearch = React.useCallback(() => {
        let filtered = users;

        // البحث في الاسم والإيميل
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.phone && user.phone.includes(searchTerm))
            );
        }

        // تصفية حسب النوع
        if (selectedRole !== 'ALL') {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        // ترتيب النتائج (محسّن للتعامل مع القيم الفارغة واللغة)
        filtered.sort((a, b) => {
            if (sortBy === 'createdAt') {
                const aTime = new Date(a.createdAt).getTime();
                const bTime = new Date(b.createdAt).getTime();
                return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
            }

            const aStr = (sortBy === 'email' ? a.email : (a.name ?? '')).toString().toLowerCase();
            const bStr = (sortBy === 'email' ? b.email : (b.name ?? '')).toString().toLowerCase();

            const cmp = aStr.localeCompare(bStr, undefined, { sensitivity: 'base', numeric: true });
            return sortOrder === 'asc' ? cmp : -cmp;
        });

        onFilteredUsers(filtered);
    }, [users, searchTerm, selectedRole, sortBy, sortOrder, onFilteredUsers]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRole('ALL');
        setSortBy('name');
        setSortOrder('asc');
        onFilteredUsers(users);
    };

    const handleRoleFilter = (role: UserRole | 'ALL') => {
        setSelectedRole(role);
    };

    // تشغيل البحث تلقائياً عند تغيير المعايير
    React.useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{translations?.admin.users.filter.title ?? 'البحث والتصفية'}</h3>
            </div>

            {/* شريط البحث */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={translations?.admin.users.filter.searchPlaceholder ?? 'البحث بالاسم، الإيميل، أو رقم الهاتف...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {translations?.admin.users.filter.clear ?? 'مسح'}
                </Button>
            </div>

            {/* تصفية حسب النوع */}
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">{translations?.admin.users.filter.role ?? 'تصفية حسب النوع:'}</span>
                <div className="flex gap-2">
                    <Button
                        variant={selectedRole === 'ALL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRoleFilter('ALL')}
                        className="flex items-center gap-1"
                    >
                        <Users className="h-3 w-3" />
                        {(translations?.admin.users.filter.all ?? 'الكل ({count})').replace('{count}', users.length.toString())}
                    </Button>
                    <Button
                        variant={selectedRole === UserRole.ADMIN ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRoleFilter(UserRole.ADMIN)}
                        className="flex items-center gap-1"
                    >
                        <Shield className="h-3 w-3" />
                        {(translations?.admin.users.filter.admins ?? 'المديرين ({count})').replace('{count}', users.filter(u => u.role === UserRole.ADMIN).length.toString())}
                    </Button>
                    <Button
                        variant={selectedRole === UserRole.USER ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRoleFilter(UserRole.USER)}
                        className="flex items-center gap-1"
                    >
                        <Users className="h-3 w-3" />
                        {(translations?.admin.users.filter.users ?? 'المستخدمين ({count})').replace('{count}', users.filter(u => u.role === UserRole.USER).length.toString())}
                    </Button>
                </div>
            </div>

            {/* ترتيب النتائج */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">{translations?.admin.users.filter.sortBy ?? 'ترتيب حسب:'}</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'createdAt')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                    <option value="name">{translations?.admin.users.filter.sort.name ?? 'الاسم'}</option>
                    <option value="email">{translations?.admin.users.filter.sort.email ?? 'الإيميل'}</option>
                    <option value="createdAt">{translations?.admin.users.filter.sort.createdAt ?? 'تاريخ الانضمام'}</option>
                </select>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                    <option value="asc">{translations?.admin.users.filter.sort.asc ?? 'تصاعدي'}</option>
                    <option value="desc">{translations?.admin.users.filter.sort.desc ?? 'تنازلي'}</option>
                </select>
            </div>
        </div>
    );
}
