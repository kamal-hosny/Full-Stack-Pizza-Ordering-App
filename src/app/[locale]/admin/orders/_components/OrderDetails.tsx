"use client";

import { Order } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Calendar, CreditCard, Package } from "lucide-react";
import Image from "next/image";
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

interface OrderDetailsProps {
  order: OrderWithProducts;
  translations: Translations;
  locale: Locale;
}

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

export default function OrderDetails({ order, translations, locale }: OrderDetailsProps) {
  const statusLabels = getStatusLabels(translations);
  const paymentMethodLabels = getPaymentMethodLabels(locale);
  const paymentStatusLabels = getPaymentStatusLabels(locale);
  // Temporary typing bridge until Translations type includes admin.orders
  type OrdersDetailsT = {
    orderNumberPrefix?: string;
    createdOn?: string;
    customerInfo?: string;
    email?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    notes?: string;
    orderSummary?: string;
    subtotal?: string;
    deliveryFee?: string;
    total?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentId?: string;
    orderItems?: string;
    qtyPrefix?: string;
    totalPrefix?: string;
    orderTimeline?: string;
    orderCreated?: string;
    orderUpdated?: string;
  };
  const ordersT = ((translations as unknown as { admin?: { orders?: { details?: OrdersDetailsT } } }).admin?.orders) || { details: {} };
  const d = ordersT.details || {};
  const L = {
    orderNumberPrefix: d.orderNumberPrefix ?? (locale === "ar" ? "طلب #" : "Order #"),
    createdOn: d.createdOn ?? (locale === "ar" ? "تم الإنشاء في " : "Created on "),
    customerInfo: d.customerInfo ?? (locale === "ar" ? "بيانات العميل" : "Customer Info"),
    email: d.email ?? (locale === "ar" ? "البريد الإلكتروني" : "Email"),
    phone: d.phone ?? (locale === "ar" ? "الهاتف" : "Phone"),
    address: d.address ?? (locale === "ar" ? "العنوان" : "Address"),
    postalCode: d.postalCode ?? (locale === "ar" ? "الرمز البريدي" : "Postal Code"),
    notes: d.notes ?? (locale === "ar" ? "ملاحظات" : "Notes"),
    orderSummary: d.orderSummary ?? (locale === "ar" ? "ملخص الطلب" : "Order Summary"),
    subtotal: d.subtotal ?? (locale === "ar" ? "الإجمالي الفرعي" : "Subtotal"),
    deliveryFee: d.deliveryFee ?? (locale === "ar" ? "رسوم التوصيل" : "Delivery Fee"),
    total: d.total ?? (locale === "ar" ? "الإجمالي" : "Total"),
    paymentMethod: d.paymentMethod ?? (locale === "ar" ? "طريقة الدفع" : "Payment Method"),
    paymentStatus: d.paymentStatus ?? (locale === "ar" ? "حالة الدفع" : "Payment Status"),
    paymentId: d.paymentId ?? (locale === "ar" ? "رقم الدفع" : "Payment ID"),
    orderItems: d.orderItems ?? (locale === "ar" ? "عناصر الطلب" : "Order Items"),
    qtyPrefix: d.qtyPrefix ?? (locale === "ar" ? "الكمية: " : "Qty: "),
    totalPrefix: d.totalPrefix ?? (locale === "ar" ? "الإجمالي: " : "Total: "),
    orderTimeline: d.orderTimeline ?? (locale === "ar" ? "الخط الزمني للطلب" : "Order Timeline"),
    orderCreated: d.orderCreated ?? (locale === "ar" ? "تم إنشاء الطلب" : "Order Created"),
    orderUpdated: d.orderUpdated ?? (locale === "ar" ? "تم تحديث الطلب" : "Order Updated"),
  };
  return (
    <div className="space-y-4 max-h-[80vh] ">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-white pb-4 border-b">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {L.orderNumberPrefix + order.id.slice(-8)}
          </h2>
          <p className="text-sm text-gray-600">
            {L.createdOn}
            {format(new Date(order.createdAt), "dd/MM/yyyy 'at' HH:mm")}
          </p>
        </div>
        <Badge className={`${statusColors[order.status]} text-sm sm:text-lg px-3 py-2 whitespace-nowrap`}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Customer Information */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-4 w-4" />
              {L.customerInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500">{L.email}</label>
              <p className="text-sm text-gray-900 break-all">{order.userEmail}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">{L.phone}</label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Phone className="h-3 w-3 flex-shrink-0" />
                {order.phone}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">{L.address}</label>
              <p className="text-sm text-gray-900 flex items-start gap-2">
                <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                <span className="break-words">
                  {order.streetAddress}<br />
                  {order.city}, {order.country}<br />
                  {L.postalCode + ": "}{order.postalCode}
                </span>
              </p>
            </div>
            {order.notes && (
              <div>
                <label className="text-xs font-medium text-gray-500">{L.notes}</label>
                <p className="text-sm text-gray-900 break-words">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-4 w-4" />
              {L.orderSummary}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{L.subtotal}</span>
              <span className="font-medium">{formatCurrency(order.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{L.deliveryFee}</span>
              <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>{L.total}</span>
              <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{L.paymentMethod}</span>
              <span className="text-sm font-medium">{paymentMethodLabels[order.paymentMethod]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{L.paymentStatus}</span>
              <Badge className={`text-xs ${paymentStatusColors[order.paymentStatus]}`}>
                {paymentStatusLabels[order.paymentStatus]}
              </Badge>
            </div>
            {order.stripePaymentIntentId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{L.paymentId}</span>
                <span className="text-xs font-mono text-gray-500">{order.stripePaymentIntentId}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-4 w-4" />
            {L.orderItems}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.products.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-xs text-gray-600">{L.qtyPrefix}{item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-sm">{formatCurrency(item.product.basePrice)}</p>
                  <p className="text-xs text-gray-600">
                    {L.totalPrefix}{formatCurrency(item.product.basePrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-4 w-4" />
            {L.orderTimeline}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="font-medium text-sm">{L.orderCreated}</p>
                <p className="text-xs text-gray-600">
                  {format(new Date(order.createdAt), "dd/MM/yyyy 'at' HH:mm")}
                </p>
              </div>
            </div>
            {order.updatedAt !== order.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{L.orderUpdated}</p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(order.updatedAt), "dd/MM/yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
