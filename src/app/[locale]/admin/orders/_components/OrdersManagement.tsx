"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Search, Filter, Eye } from "lucide-react";
import OrderDetails from "./OrderDetails";
import { updateOrderStatus } from "../_actions/order";
import { Translations } from "@/types/translations";
import { Locale } from "@/i18n.config";

interface OrderWithProducts extends Order {
  products: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      image: string;
      basePrice: number;
    };
  }>;
}

interface OrdersManagementProps {
  orders: OrderWithProducts[];
  translations: Translations;
  locale: Locale;
}

type OrdersTranslations = {
  filter?: {
    searchPlaceholder?: string;
    filterByStatus?: string;
    allStatuses?: string;
    apply?: string;
    exportCsv?: string;
  };
  empty?: {
    title?: string;
    description?: string;
  };
  table?: {
    order?: string;
    customer?: string;
    items?: string;
    total?: string;
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    date?: string;
    actions?: string;
    item?: string;
    itemsPlural?: string;
    subtotal?: string;
  };
  modal?: {
    titlePrefix?: string;
  };
  summary?: {
    totalOrdersPrefix?: string;
    tipChangeStatus?: string;
    tipViewDetails?: string;
    tipExportCsv?: string;
  };
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  READY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const getStatusLabels = (t: Translations) => ({
  PENDING: t.admin.dashboard.statusLabels.PENDING,
  CONFIRMED: t.admin.dashboard.statusLabels.CONFIRMED,
  PREPARING: t.admin.dashboard.statusLabels.PREPARING,
  READY: t.admin.dashboard.statusLabels.READY,
  DELIVERED: t.admin.dashboard.statusLabels.DELIVERED,
  CANCELLED: t.admin.dashboard.statusLabels.CANCELLED,
});

const getPaymentMethodLabels = (locale: Locale) => ({
  CASH_ON_DELIVERY: locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery",
  STRIPE: locale === "ar" ? "الدفع الإلكتروني" : "Online Payment",
});

const getPaymentStatusLabels = (locale: Locale) => ({
  PENDING: locale === "ar" ? "في الانتظار" : "Pending",
  PAID: locale === "ar" ? "مدفوع" : "Paid",
  FAILED: locale === "ar" ? "فشل الدفع" : "Payment Failed",
  REFUNDED: locale === "ar" ? "مسترد" : "Refunded",
});

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

export default function OrdersManagement({ orders, translations, locale }: OrdersManagementProps) {
  const statusLabels = getStatusLabels(translations);
  const paymentMethodLabels = getPaymentMethodLabels(locale);
  const paymentStatusLabels = getPaymentStatusLabels(locale);
  // Temporary typing bridge until Translations type includes admin.orders
  const ordersT = (translations as unknown as { admin?: { orders?: OrdersTranslations } }).admin?.orders;
  const [allOrders, setAllOrders] = useState(orders);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  // Filter orders based on search and status
  const handleFilter = () => {
    let filtered = allOrders;

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter((order) => {
        const emailMatch = (order.userEmail || "").toLowerCase().includes(term);
        const phoneMatch = (order.phone || "").toLowerCase().includes(term);
        const idMatch = (order.id || "").toLowerCase().includes(term);
        return emailMatch || phoneMatch || idMatch;
      });
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  // Keep local copy of orders in sync with props
  useEffect(() => {
    setAllOrders(orders);
  }, [orders]);

  // Auto-apply filters when inputs or data change
  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrders, searchTerm, statusFilter]);

  // Update order status
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state
      setAllOrders(prev => prev.map(order => (
        order.id === orderId ? { ...order, status: newStatus } : order
      )));
      // Also update the filtered list immediately so the Select reflects the change without delay
      setFilteredOrders(prev => prev.map(order => (
        order.id === orderId ? { ...order, status: newStatus } : order
      )));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const csvContent = [
      ["Order ID", "Customer Email", "Phone", "Status", "Total", "Date", "Items"],
      ...filteredOrders.map(order => [
        order.id,
        order.userEmail,
        order.phone,
        statusLabels[order.status],
        order.totalPrice.toString(),
        format(new Date(order.createdAt), "yyyy-MM-dd HH:mm"),
        order.products.map(p => `${p.product.name} (x${p.quantity})`).join(", ")
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={ordersT?.filter?.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "ALL")}>
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
              <SelectValue placeholder={ordersT?.filter?.filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{ordersT?.filter?.allStatuses}</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-sm">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={handleFilter} className="flex items-center gap-2 text-sm px-3 py-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{ordersT?.filter?.apply}</span>
            </Button>

            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2 text-sm px-3 py-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{ordersT?.filter?.exportCsv}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-yellow-600 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">{ordersT?.empty?.title}</h3>
          <p className="text-yellow-700">{ordersT?.empty?.description}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {ordersT?.table?.order}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    {ordersT?.table?.customer}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    {ordersT?.table?.items}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {ordersT?.table?.total}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {ordersT?.table?.status}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    {ordersT?.table?.paymentMethod}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    {ordersT?.table?.paymentStatus}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    {ordersT?.table?.date}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {ordersT?.table?.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {order.userEmail}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[200px]">{order.userEmail}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-900">
                        {order.products.length} {(order.products.length === 1 ? ordersT?.table?.item : ordersT?.table?.itemsPlural)}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {order.products.map((op, index) => (
                          <span key={op.id}>
                            {op.product.name} (x{op.quantity})
                            {index < order.products.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {ordersT?.table?.subtotal}: {formatCurrency(order.subTotal)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <Badge className={`${statusColors[order.status]} text-xs`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-900">
                        {paymentMethodLabels[order.paymentMethod]}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <Badge className={`${paymentStatusColors[order.paymentStatus]} text-xs`}>
                        {paymentStatusLabels[order.paymentStatus]}
                      </Badge>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Dialog open={openOrderId === order.id} onOpenChange={(open) => setOpenOrderId(open ? order.id : null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] overflow-hidden">
                            <DialogHeader className="pb-4">
                              <DialogTitle className="text-lg sm:text-xl">{ordersT?.modal?.titlePrefix} #{order.id.slice(-8)}</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                              <OrderDetails order={order} translations={translations} locale={locale} />
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-[120px] sm:w-[150px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">{translations.admin.tabs.orders}</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• {(ordersT?.summary?.totalOrdersPrefix || "Total orders: ")}{filteredOrders.length}</p>
              <p>• {ordersT?.summary?.tipChangeStatus}</p>
              <p>• {ordersT?.summary?.tipViewDetails}</p>
              <p>• {ordersT?.summary?.tipExportCsv}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
