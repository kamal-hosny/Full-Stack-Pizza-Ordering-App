import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getOrders } from "@/server/_actions/order";
import { getCategories } from "@/server/db/categories";
import { db } from "@/lib/prisma";
import AdminDashboard from "./_components/AdminDashboard";
import getTrans from "@/lib/translation";

async function AdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }

  // Get dashboard data
  const [orders, categories, products, users] = await Promise.all([
    getOrders(),
    getCategories(),
    db.product.count(),
    db.user.count(),
  ]);

  const stats = {
    totalOrders: orders.length,
    totalCategories: categories.length,
    totalProducts: products,
    totalUsers: users,
    pendingOrders: orders.filter(order => order.status === 'PENDING').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard 
          user={session?.user} 
          stats={stats}
          recentOrders={orders.slice(0, 5)}
          translations={await getTrans(locale)}
        />
      </div>
    </main>
  );
}

export default AdminPage;
