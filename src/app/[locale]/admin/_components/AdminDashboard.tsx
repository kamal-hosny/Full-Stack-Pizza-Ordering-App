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
import type { Translations } from "@/types/translations";
import type { FC } from "react";

import { User as PrismaUser, Order } from "@prisma/client";

type RecentOrder = Pick<Order, "id" | "status" | "totalPrice"> & { userEmail: string };

export interface AdminDashboardProps {
  user: Partial<PrismaUser> | null;
  stats: {
    totalOrders: number;
    totalCategories: number;
    totalProducts: number;
    totalUsers: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  recentOrders: RecentOrder[];
  translations: Translations;
  [key: string]: any;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  READY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabelsFallback = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const AdminDashboard: FC<AdminDashboardProps> = ({ user, stats, recentOrders, translations }) => {
  const { locale } = useParams();

  const statCards = [
    {
      title: translations.admin.dashboard.stats.totalOrders,
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-[#fe0019]",
      bgColor: "bg-[#fe0019]/10",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: translations.admin.dashboard.stats.pendingOrders,
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-[#fe0019]",
      bgColor: "bg-[#fe0019]/10",
      change: "+5%",
      changeType: "neutral"
    },
    {
      title: translations.admin.dashboard.stats.totalRevenue,
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-[#fe0019]",
      bgColor: "bg-[#fe0019]/10",
      change: "+18%",
      changeType: "positive"
    },
    {
      title: translations.admin.dashboard.stats.products,
      value: stats.totalProducts,
      icon: Package,
      color: "text-[#fe0019]",
      bgColor: "bg-[#fe0019]/10",
      change: "+3",
      changeType: "positive"
    },
    {
      title: translations.admin.dashboard.stats.categories,
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-[#fe0019]",
      bgColor: "bg-[#fe0019]/10",
      change: "+1",
      changeType: "positive"
    },
    {
      title: translations.admin.dashboard.stats.users,
      value: stats.totalUsers,
      icon: Users,
      color: "text-[#fe0019]",
      bgColor: "bg-[#fe0019]/10",
      change: "+8%",
      changeType: "positive"
    }
  ];

  const quickActions = [
    {
      title: translations.admin.dashboard.quickActions.addProduct,
      description: translations.admin.dashboard.quickActions.addProductDesc,
      icon: Plus,
      href: `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`,
      color: "bg-[#fe0019] hover:bg-[#df0016]"
    },
    {
      title: translations.admin.dashboard.quickActions.manageOrders,
      description: translations.admin.dashboard.quickActions.manageOrdersDesc,
      icon: ShoppingCart,
      href: `/${locale}/${Routes.ADMIN}/${Pages.ORDERS}`,
      color: "bg-[#fe0019] hover:bg-[#df0016]"
    },
    {
      title: translations.admin.dashboard.quickActions.manageCategories,
      description: translations.admin.dashboard.quickActions.manageCategoriesDesc,
      icon: FolderOpen,
      href: `/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`,
      color: "bg-[#fe0019] hover:bg-[#df0016]"
    },
    {
      title: translations.admin.dashboard.quickActions.manageUsers,
      description: translations.admin.dashboard.quickActions.manageUsersDesc,
      icon: Users,
      href: `/${locale}/${Routes.ADMIN}/${Pages.USERS}`,
      color: "bg-[#fe0019] hover:bg-[#df0016]"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#fe0019] to-[#fe0019] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {translations.admin.dashboard.welcome}، {user?.name || translations.profile.role.admin}! 👋
            </h1>
            <p className="text-white/80 text-lg">
              {translations.admin.dashboard.overviewToday}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-white/80 text-sm">{translations.admin.dashboard.lastUpdate}</p>
              <p className="text-white font-semibold">
                {format(new Date(), "dd/MM/yyyy HH:mm")}
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
                  <span className={stat.changeType === 'positive' ? 'text-[#fe0019]' : 'text-gray-600'}>
                    {translations.admin.dashboard.stats.changeSinceLastMonth.replace("{change}", stat.change)}
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
              <CardTitle className="text-xl font-semibold">{translations.admin.dashboard.recentOrdersTitle}</CardTitle>
              <Link href={`/${locale}/${Routes.ADMIN}/${Pages.ORDERS}`}>
                <Button variant="outline" size="sm" className="border-[#fe0019] text-[#fe0019] hover:bg-[#fe0019]/10">
                  <Eye className="h-4 w-4 mr-2" />
                  {translations.admin.dashboard.viewAll}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{translations.admin.dashboard.noRecentOrders}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {translations.admin.dashboard.orderNumberPrefix}{order.id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-500">{order.userEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {(translations.admin.dashboard.statusLabels as any)[order.status] ?? statusLabelsFallback[order.status as keyof typeof statusLabelsFallback]}
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
            <CardTitle className="text-xl font-semibold">{translations.admin.dashboard.quickActionsTitle}</CardTitle>
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
          <CardTitle className="text-xl font-semibold">{translations.admin.dashboard.profileTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#fe0019] to-[#fe0019] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name || translations.profile.role.admin}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <Badge className="bg-[#fe0019]/10 text-[#fe0019] mt-1">{translations.admin.dashboard.profileRoleAdmin}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-[#fe0019] text-[#fe0019] hover:bg-[#fe0019]/10">
              <Edit className="h-4 w-4 mr-2" />
              {translations.edit}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
