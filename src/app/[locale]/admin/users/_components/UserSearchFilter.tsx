'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Users, Shield } from 'lucide-react';
import { UserRole } from '@/constants/enums';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
    streetAddress?: string;
    city?: string;
    country?: string;
}

interface UserSearchFilterProps {
    users: User[];
    onFilteredUsers: (users: User[]) => void;
}

export default function UserSearchFilter({ users, onFilteredUsers }: UserSearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSearch = () => {
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

        // ترتيب النتائج
        filtered.sort((a, b) => {
            let aValue: string | Date;
            let bValue: string | Date;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'createdAt':
                    aValue = a.createdAt;
                    bValue = b.createdAt;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        onFilteredUsers(filtered);
    };

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
    }, [searchTerm, selectedRole, sortBy, sortOrder, users]);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">البحث والتصفية</h3>
            </div>

            {/* شريط البحث */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="البحث بالاسم، الإيميل، أو رقم الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    مسح
                </Button>
            </div>

            {/* تصفية حسب النوع */}
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">تصفية حسب النوع:</span>
                <div className="flex gap-2">
                    <Button
                        variant={selectedRole === 'ALL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRoleFilter('ALL')}
                        className="flex items-center gap-1"
                    >
                        <Users className="h-3 w-3" />
                        الكل ({users.length})
                    </Button>
                    <Button
                        variant={selectedRole === UserRole.ADMIN ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRoleFilter(UserRole.ADMIN)}
                        className="flex items-center gap-1"
                    >
                        <Shield className="h-3 w-3" />
                        المديرين ({users.filter(u => u.role === UserRole.ADMIN).length})
                    </Button>
                    <Button
                        variant={selectedRole === UserRole.USER ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRoleFilter(UserRole.USER)}
                        className="flex items-center gap-1"
                    >
                        <Users className="h-3 w-3" />
                        المستخدمين ({users.filter(u => u.role === UserRole.USER).length})
                    </Button>
                </div>
            </div>

            {/* ترتيب النتائج */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">ترتيب حسب:</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'createdAt')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                    <option value="name">الاسم</option>
                    <option value="email">الإيميل</option>
                    <option value="createdAt">تاريخ الانضمام</option>
                </select>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                    <option value="asc">تصاعدي</option>
                    <option value="desc">تنازلي</option>
                </select>
            </div>
        </div>
    );
}
