import { getOrders } from "@/server/_actions/order";
import OrdersManagement from "./_components/OrdersManagement";
import getTrans from "@/lib/translation";
import { Locale } from "@/i18n.config";

const OrdersPage = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale } = await params;
  const t = await getTrans(locale);
  const orders = await getOrders();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.tabs.orders}</h1>
            <p className="text-gray-600 mt-2">{t.admin.dashboard.quickActions.manageOrdersDesc}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">{t.admin.dashboard.stats.totalOrders}</p>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{t.admin.dashboard.stats.pendingOrders}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(order => order.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <OrdersManagement orders={orders} translations={t} locale={locale} />
    </div>
  );
};

export default OrdersPage;
