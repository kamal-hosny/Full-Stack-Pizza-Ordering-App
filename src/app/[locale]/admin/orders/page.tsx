import { getOrders } from "@/server/_actions/order";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import OrdersManagement from "./_components/OrdersManagement";

const OrdersPage = async () => {
  const orders = await getOrders();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
            <p className="text-gray-600 mt-2">عرض وإدارة جميع طلبات العملاء</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">الطلبات المعلقة</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(order => order.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <OrdersManagement orders={orders} />
    </div>
  );
};

export default OrdersPage;
