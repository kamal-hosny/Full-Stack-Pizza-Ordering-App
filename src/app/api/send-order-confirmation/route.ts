import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema for order confirmation email
const orderEmailSchema = z.object({
  orderId: z.string(),
  userEmail: z.string().email(),
  userName: z.string().optional(),
  totalPrice: z.number(),
  orderItems: z.array(z.object({
    productName: z.string(),
    quantity: z.number(),
    price: z.number(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = orderEmailSchema.parse(body);
    const { orderId, userEmail, userName, totalPrice, orderItems } = validatedData;

    // Generate unique tracking ID for order confirmation
    const trackingId = `order_${orderId}_${Date.now()}`;
    
    console.log('Order confirmation email tracking ID:', trackingId);

    console.log('Sending order confirmation email to:', userEmail);
    console.log('Order ID:', orderId);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);
    
    // Send order confirmation email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Pizza Shop <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🍕 Order Confirmation</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order!</p>
          </div>
          
          <div style="padding: 30px; background-color: white; margin: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${orderId}</p>
              <p><strong>Customer:</strong> ${userName || userEmail}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Total Amount:</strong> $${totalPrice.toFixed(2)}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Order Items</h3>
              ${orderItems.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <div>
                    <strong>${item.productName}</strong>
                    <span style="color: #666;">x${item.quantity}</span>
                  </div>
                  <div style="font-weight: bold;">$${item.price.toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="color: #2d5a2d; margin-top: 0;">Order Status</h3>
              <p style="color: #2d5a2d; font-size: 18px; font-weight: bold; margin: 0;">
                ✅ Order Received Successfully!
              </p>
              <p style="color: #666; margin: 10px 0 0 0;">
                We'll start preparing your order right away. You'll receive updates on your order status.
              </p>
            </div>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              Thank you for choosing Pizza Shop! 🍕
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">
              This email was sent from your Pizza Shop order system.
            </p>
          </div>
          
          <!-- Email Tracking Pixel -->
          <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/track/email/${trackingId}" 
               width="1" height="1" style="display:none;" alt="" />
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send order confirmation email', details: error },
        { status: 500 }
      );
    }

    console.log('Order confirmation email sent successfully:', data);
    return NextResponse.json(
      { message: 'Order confirmation email sent successfully', data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Order confirmation email error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
