"use client";

import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Users, 
  Package, 
  FolderOpen, 
  DollarSign, 
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Plus
} from "lucide-react";
import Link from "@/components/link";
import { useParams } from "next/navigation";
import { Routes, Pages } from "@/constants/enums";

interface AdminDashboardProps {
  user: any;
  translations: any;
  stats: {
    totalOrders: number;
    totalCategories: number;
    totalProducts: number;
    totalUsers: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  recentOrders: any[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  READY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "في الانتظار",
  CONFIRMED: "تم التأكيد",
  PREPARING: "قيد التحضير",
  READY: "جاهز للاستلام",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

export default function AdminDashboard({ user, translations, stats, recentOrders }: AdminDashboardProps) {
  const { locale } = useParams();

  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "الطلبات المعلقة",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "+5%",
      changeType: "neutral"
    },
    {
      title: "إجمالي الإيرادات",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+18%",
      changeType: "positive"
    },
    {
      title: "المنتجات",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+3",
      changeType: "positive"
    },
    {
      title: "الفئات",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+1",
      changeType: "positive"
    },
    {
      title: "المستخدمين",
      value: stats.totalUsers,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      change: "+8%",
      changeType: "positive"
    }
  ];

  const quickActions = [
    {
      title: "إضافة منتج جديد",
      description: "أضف منتج جديد إلى القائمة",
      icon: Plus,
      href: `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "إدارة الطلبات",
      description: "عرض وإدارة جميع الطلبات",
      icon: ShoppingCart,
      href: `/${locale}/${Routes.ADMIN}/${Pages.ORDERS}`,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "إدارة الفئات",
      description: "تنظيم فئات المنتجات",
      icon: FolderOpen,
      href: `/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "إدارة المستخدمين",
      description: "عرض وإدارة المستخدمين",
      icon: Users,
      href: `/${locale}/${Routes.ADMIN}/${Pages.USERS}`,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              مرحباً، {user?.name || "المدير"}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              إليك نظرة عامة على أداء متجرك اليوم
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-blue-100 text-sm">آخر تحديث</p>
              <p className="text-white font-semibold">
                {format(new Date(), "dd/MM/yyyy 'في' HH:mm")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'}>
                    {stat.change} من الشهر الماضي
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">الطلبات الأخيرة</CardTitle>
              <Link href={`/${locale}/${Routes.ADMIN}/${Pages.ORDERS}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  عرض الكل
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد طلبات حديثة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            طلب #{order.id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-500">{order.userEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">الإجراءات السريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <div className={`p-4 rounded-lg text-white ${action.color} hover:shadow-md transition-all cursor-pointer`}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">معلومات الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name || "المدير"}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <Badge className="bg-green-100 text-green-800 mt-1">مدير</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              تعديل الملف
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

