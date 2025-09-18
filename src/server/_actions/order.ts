"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface OrderData {
  userEmail: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
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
        paid: false, // Default to false, can be updated when payment is processed
      },
    });

    // Create order products
    const orderProducts = await Promise.all(
      orderData.cartItems.map((item) =>
        db.orderProduct.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            // Note: userId is optional in the schema, can be added later if user authentication is implemented
          },
        })
      )
    );

    // Revalidate the orders page if it exists
    revalidatePath("/admin/orders");
    
    return {
      success: true,
      orderId: order.id,
      message: "Order created successfully!",
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: "Failed to create order. Please try again.",
    };
  }
}

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
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
