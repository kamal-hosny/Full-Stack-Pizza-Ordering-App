import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { orderId, userEmail, userName, status, orderItems, totalPrice } = await request.json();

    interface EmailOrderItem {
      productName: string;
      quantity: number;
      price: number;
    }

    const statusMessages = {
      PENDING: "طلبك في الانتظار",
      CONFIRMED: "تم تأكيد طلبك",
      PREPARING: "طلبك قيد التحضير",
      READY: "طلبك جاهز للاستلام",
      DELIVERED: "تم تسليم طلبك",
      CANCELLED: "تم إلغاء طلبك"
    };

    const statusDescriptions = {
      PENDING: "نشكرك على طلبك! سنقوم بمراجعة طلبك قريباً.",
      CONFIRMED: "تم تأكيد طلبك وسيتم تحضيره قريباً.",
      PREPARING: "طلبك قيد التحضير حالياً وسيتم إشعارك عند الانتهاء.",
      READY: "طلبك جاهز للاستلام! يمكنك الحضور لاستلامه.",
      DELIVERED: "تم تسليم طلبك بنجاح! نتمنى أن تستمتع بوجبتك.",
      CANCELLED: "نعتذر، تم إلغاء طلبك. يرجى التواصل معنا إذا كان لديك أي استفسارات."
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تحديث حالة الطلب</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #e74c3c;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0;
          }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .status-confirmed { background-color: #d1ecf1; color: #0c5460; }
          .status-preparing { background-color: #ffeaa7; color: #6c5ce7; }
          .status-ready { background-color: #a29bfe; color: white; }
          .status-delivered { background-color: #d4edda; color: #155724; }
          .status-cancelled { background-color: #f8d7da; color: #721c24; }
          .order-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .order-item:last-child {
            border-bottom: none;
          }
          .total {
            font-size: 20px;
            font-weight: bold;
            color: #e74c3c;
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e74c3c;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🍕 بيتزا ديلفري</div>
            <h1>تحديث حالة الطلب</h1>
          </div>
          
          <div style="text-align: center;">
            <h2>مرحباً ${userName}!</h2>
            <div class="status-badge status-${status.toLowerCase()}">
              ${statusMessages[status as keyof typeof statusMessages]}
            </div>
            <p style="font-size: 16px; margin: 20px 0;">
              ${statusDescriptions[status as keyof typeof statusDescriptions]}
            </p>
          </div>

          <div class="order-details">
            <h3 style="margin-top: 0; color: #e74c3c;">تفاصيل الطلب #${orderId.slice(-8)}</h3>
            ${(orderItems as EmailOrderItem[]).map((item) => `
              <div class="order-item">
                <span>${item.productName} × ${item.quantity}</span>
                <span>${item.price.toFixed(2)} ريال</span>
              </div>
            `).join('')}
            <div class="total">
              المجموع الكلي: ${totalPrice.toFixed(2)} ريال
            </div>
          </div>

          <div class="footer">
            <p>شكراً لاختيارك بيتزا ديلفري!</p>
            <p>إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Pizza Delivery <noreply@pizzadelivery.com>",
      to: [userEmail],
      subject: `${statusMessages[status as keyof typeof statusMessages]} - طلب #${orderId.slice(-8)}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending order status update email:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in send-order-status-update:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
