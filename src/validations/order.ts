import { z } from "zod";

export const orderSchema = z.object({
  userEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .min(10, "Address must be at least 10 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .min(3, "Postal code must be at least 3 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .min(2, "Country must be at least 2 characters"),
  cartItems: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        sizeId: z.string().optional(),
        extrasIds: z.array(z.string()).optional(),
      })
    )
    .min(1, "Cart must contain at least one item"),
  subTotal: z.number().min(0, "Subtotal must be a positive number"),
  deliveryFee: z.number().min(0, "Delivery fee must be a positive number"),
  totalPrice: z.number().min(0, "Total price must be a positive number"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
