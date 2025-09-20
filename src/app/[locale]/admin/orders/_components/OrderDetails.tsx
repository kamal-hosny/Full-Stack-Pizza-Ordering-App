"use client";

import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Calendar, CreditCard, Package } from "lucide-react";

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

const paymentMethodLabels = {
  CASH_ON_DELIVERY: "الدفع عند الاستلام",
  STRIPE: "الدفع الإلكتروني",
};

const paymentStatusLabels = {
  PENDING: "في الانتظار",
  PAID: "مدفوع",
  FAILED: "فشل الدفع",
  REFUNDED: "مسترد",
};

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-white pb-4 border-b">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            طلب #{order.id.slice(-8)}
          </h2>
          <p className="text-sm text-gray-600">
            تم إنشاؤه في {format(new Date(order.createdAt), "dd/MM/yyyy 'في' HH:mm")}
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
              معلومات العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500">البريد الإلكتروني</label>
              <p className="text-sm text-gray-900 break-all">{order.userEmail}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">رقم الهاتف</label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Phone className="h-3 w-3 flex-shrink-0" />
                {order.phone}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">العنوان</label>
              <p className="text-sm text-gray-900 flex items-start gap-2">
                <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                <span className="break-words">
                  {order.streetAddress}<br />
                  {order.city}, {order.country}<br />
                  الرمز البريدي: {order.postalCode}
                </span>
              </p>
            </div>
            {order.notes && (
              <div>
                <label className="text-xs font-medium text-gray-500">ملاحظات</label>
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
              ملخص الطلب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-medium">{formatCurrency(order.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">رسوم التوصيل</span>
              <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>المجموع الكلي</span>
              <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">طريقة الدفع</span>
              <span className="text-sm font-medium">{paymentMethodLabels[order.paymentMethod]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">حالة الدفع</span>
              <Badge className={`text-xs ${paymentStatusColors[order.paymentStatus]}`}>
                {paymentStatusLabels[order.paymentStatus]}
              </Badge>
            </div>
            {order.stripePaymentIntentId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">معرف الدفع</span>
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
            عناصر الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.products.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-sm">{formatCurrency(item.product.basePrice)}</p>
                  <p className="text-xs text-gray-600">
                    المجموع: {formatCurrency(item.product.basePrice * item.quantity)}
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
            سجل الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="font-medium text-sm">تم إنشاء الطلب</p>
                <p className="text-xs text-gray-600">
                  {format(new Date(order.createdAt), "dd/MM/yyyy 'في' HH:mm")}
                </p>
              </div>
            </div>
            {order.updatedAt !== order.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">تم تحديث الطلب</p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(order.updatedAt), "dd/MM/yyyy 'في' HH:mm")}
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
