"use server";

import { db } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    // Get order details first
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Send status update email to customer
    try {
      const orderItems = order.products.map(op => ({
        productName: op.product.name,
        quantity: op.quantity,
        price: op.product.basePrice * op.quantity,
      }));

      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-order-status-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          userEmail: order.userEmail,
          userName: order.userEmail.split('@')[0],
          status: status,
          orderItems: orderItems,
          totalPrice: order.totalPrice,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send order status update email');
      }
    } catch (emailError) {
      console.error('Error sending order status update email:', emailError);
    }

    revalidatePath("/admin/orders");
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: {
            product: true,
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

export async function getOrdersByStatus(status: OrderStatus) {
  try {
    const orders = await db.order.findMany({
      where: { status },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }
}

export async function getOrdersStats() {
  try {
    const stats = await db.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const totalOrders = await db.order.count();
    const totalRevenue = await db.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });

    return {
      statusCounts: stats,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      statusCounts: [],
      totalOrders: 0,
      totalRevenue: 0,
    };
  }
}
