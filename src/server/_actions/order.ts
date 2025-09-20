"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export interface OrderData {
  userEmail: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  notes?: string;
  paymentMethod: "CASH_ON_DELIVERY" | "STRIPE";
  cartItems: Array<{
    productId: string;
    quantity: number;
    sizeId?: string;
    extrasIds?: string[];
  }>;
  subTotal: number;
  deliveryFee: number;
  totalPrice: number;
}

export async function createOrder(orderData: OrderData) {
  try {
    console.log("Creating order with data:", orderData);
    
    // Validate required fields
    if (!orderData.userEmail || !orderData.phone || !orderData.streetAddress) {
      return {
        success: false,
        message: "Missing required fields. Please fill all required information.",
      };
    }

    // Create the order
    const order = await db.order.create({
      data: {
        userEmail: orderData.userEmail,
        phone: orderData.phone,
        streetAddress: orderData.streetAddress,
        postalCode: orderData.postalCode,
        city: orderData.city,
        country: orderData.country,
        subTotal: orderData.subTotal,
        deliveryFee: orderData.deliveryFee,
        totalPrice: orderData.totalPrice,
        paid: orderData.paymentMethod === "CASH_ON_DELIVERY" ? false : false, // Will be updated after payment
        status: OrderStatus.PENDING, // Default to pending
        notes: orderData.notes,
        paymentMethod: orderData.paymentMethod as PaymentMethod,
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    console.log("Order created successfully:", order.id);

    // Create order products
    console.log("Creating order products for order:", order.id);
    const orderProducts = await Promise.all(
      orderData.cartItems.map((item) => {
        console.log("Creating product for order:", item);
        return db.orderProduct.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            // Note: userId is optional in the schema, can be added later if user authentication is implemented
          },
        });
      })
    );
    console.log("Order products created successfully:", orderProducts.length);

    // Get order details with products for email
    const orderWithProducts = await db.order.findUnique({
      where: { id: order.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send order confirmation email
    if (orderWithProducts) {
      try {
        const orderItems = orderWithProducts.products.map(op => ({
          productName: op.product.name,
          quantity: op.quantity,
          price: op.product.basePrice * op.quantity,
        }));

        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-order-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            userEmail: orderData.userEmail,
            userName: orderData.userEmail.split('@')[0], // Use email prefix as name
            totalPrice: orderData.totalPrice,
            orderItems,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send order confirmation email');
        }
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
      }
    }

    // Revalidate the orders page if it exists
    revalidatePath("/admin/orders");
    
    return {
      success: true,
      orderId: order.id,
      message: "Order created successfully!",
    };
  } catch (error) {
    console.error("Error creating order:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          message: "Order already exists. Please try again.",
        };
      }
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          message: "Invalid product in cart. Please refresh and try again.",
        };
      }
      if (error.message.includes('Database connection')) {
        return {
          success: false,
          message: "Database connection error. Please try again later.",
        };
      }
    }
    
    return {
      success: false,
      message: "Failed to create order. Please check your information and try again.",
    };
  }
}

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: {
            product: {
              include: {
                sizes: true,
                extras: true,
              },
            },
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, paid: boolean) {
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { paid },
    });

    revalidatePath("/admin/orders");
    
    return {
      success: true,
      message: "Order status updated successfully!",
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message: "Failed to update order status.",
    };
  }
}

export async function updatePaymentStatus(
  orderId: string, 
  paymentStatus: PaymentStatus, 
  stripePaymentIntentId?: string
) {
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus,
        paid: paymentStatus === PaymentStatus.PAID,
        stripePaymentIntentId: stripePaymentIntentId || undefined,
      },
    });

    revalidatePath("/admin/orders");
    
    return {
      success: true,
      message: "Payment status updated successfully!",
    };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return {
      success: false,
      message: "Failed to update payment status.",
    };
  }
}
