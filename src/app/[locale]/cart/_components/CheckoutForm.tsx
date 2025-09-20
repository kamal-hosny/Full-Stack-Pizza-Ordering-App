
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getTotalAmount } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import { selectCartItems } from "@/redux/features/cart/cartSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { FaLock, FaHome, FaMapMarkerAlt, FaGlobe, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { createOrder } from "@/server/_actions/order";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { orderSchema, OrderFormData, PaymentMethod } from "@/validations/order";
import { useRouter } from "next/navigation";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  "pk_test_51S9Ia6KsxJcoCyADTDwbOoqNklhoeh0fQO0VB9xI3FHK0HycMJCNnJbzMrqPPbqTw71ROXuazqkutsC9b0BVGeWE00TsA61Xyw"
);

const CheckoutForm = () => {
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const totalAmount = getTotalAmount(cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      
      // Prepare order data
      const orderData: OrderFormData = {
        userEmail: formData.get("email") as string,
        phone: formData.get("phone") as string,
        streetAddress: formData.get("address") as string,
        postalCode: formData.get("postal-code") as string,
        city: formData.get("city") as string,
        country: formData.get("country") as string,
        notes: formData.get("notes") as string,
        paymentMethod: paymentMethod,
        cartItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity || 1,
          sizeId: item.size?.id,
          extrasIds: item.extras?.map(extra => extra.id),
        })),
        subTotal: totalAmount,
        deliveryFee: 5.00, // Fixed delivery fee
        totalPrice: totalAmount + 5.00,
      };

      // Validate the order data
      const validationResult = orderSchema.safeParse(orderData);
      
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        setIsProcessing(false);
        return;
      }

      // Create the order
      const result = await createOrder(orderData);

      if (result.success) {
        toast({
          title: "تم إنشاء الطلب بنجاح!",
          description: "تم إنشاء طلبك وسيتم معالجته قريباً",
        });
        
        if (paymentMethod === "CASH_ON_DELIVERY") {
          // For cash on delivery, complete the order immediately
          dispatch(clearCart());
          router.push(`/order-success?orderId=${result.orderId}`);
        } else {
          // For Stripe payment, store order ID and show payment form
          if (result.orderId) {
            setCreatedOrderId(result.orderId);
          }
        }
      } else {
        toast({
          title: "فشل في إنشاء الطلب",
          description: result.message || "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "تم الدفع بنجاح!",
      description: "تم دفع طلبك بنجاح وسيتم معالجته قريباً",
    });
    dispatch(clearCart());
    router.push(`/order-success?orderId=${createdOrderId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "فشل في الدفع",
      description: `فشل في معالجة الدفع: ${error}`,
      variant: "destructive",
    });
  };

  return (
    cart &&
    cart.length > 0 && (
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Checkout Details</h2>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FaLock className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-800">Secure Checkout</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your information is protected with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                name="email"
                className={`py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.userEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.userEmail && (
                <p className="text-red-500 text-sm">{errors.userEmail}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                type="tel"
                name="phone"
                className={`py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-700 font-medium flex items-center gap-2">
                <FaHome className="text-gray-500" />
                Street Address
              </Label>
              <Textarea
                id="address"
                placeholder="123 Main St, Apt 4B"
                name="address"
                rows={3}
                className={`py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                  errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-sm">{errors.streetAddress}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postal-code" className="text-gray-700 font-medium flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  Postal Code
                </Label>
                <Input
                  type="text"
                  id="postal-code"
                  placeholder="12345"
                  name="postal-code"
                  className={`py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm">{errors.postalCode}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city" className="text-gray-700 font-medium flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  City
                </Label>
                <Input
                  type="text"
                  id="city"
                  placeholder="New York"
                  name="city"
                  className={`py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country" className="text-gray-700 font-medium flex items-center gap-2">
                  <FaGlobe className="text-gray-500" />
                  Country
                </Label>
                <Input
                  type="text"
                  id="country"
                  placeholder="United States"
                  name="country"
                  className={`py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-gray-700 font-medium">
                ملاحظات إضافية (اختياري)
              </Label>
              <Textarea
                id="notes"
                placeholder="أي ملاحظات خاصة بالطلب..."
                name="notes"
                className="py-3 px-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300"
                rows={3}
              />
            </div>

            {/* Payment Method Selection */}
            <div className="grid gap-4">
              <Label className="text-gray-700 font-medium text-lg">
                طريقة الدفع
              </Label>
              
              <div className="grid gap-3">
                {/* Cash on Delivery Option */}
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "CASH_ON_DELIVERY" 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "CASH_ON_DELIVERY" 
                        ? "border-primary bg-primary" 
                        : "border-gray-300"
                    }`}>
                      {paymentMethod === "CASH_ON_DELIVERY" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <FaMoneyBillWave className="text-2xl text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">الدفع عند الاستلام</h3>
                      <p className="text-sm text-gray-600">ادفع نقداً عند تسليم الطلب</p>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Option */}
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === "STRIPE" 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("STRIPE")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "STRIPE" 
                        ? "border-primary bg-primary" 
                        : "border-gray-300"
                    }`}>
                      {paymentMethod === "STRIPE" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <FaCreditCard className="text-2xl text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">الدفع الإلكتروني</h3>
                      <p className="text-sm text-gray-600">ادفع بأمان عبر البطاقة الائتمانية</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-700">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Delivery Fee:</span>
                  <span className="text-gray-700">{formatCurrency(5.00)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-700 font-bold text-lg">Total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount + 5.00)}</span>
                </div>
              </div>
              
              {createdOrderId && paymentMethod === "STRIPE" ? (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    orderId={createdOrderId}
                    totalAmount={totalAmount + 5.00}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <Button 
                  className="w-full py-6 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      {paymentMethod === "STRIPE" ? "Creating Order..." : "Creating Order..."}
                    </div>
                  ) : (
                    <>
                      {paymentMethod === "STRIPE" ? (
                        <>
                          <FaCreditCard className="mr-2" />
                          Create Order & Pay
                        </>
                      ) : (
                        <>
                          <FaMoneyBillWave className="mr-2" />
                          Place Order (Cash on Delivery)
                        </>
                      )}
                    </>
                  )}
                </Button>
              )}
              
              <p className="text-center text-gray-500 text-sm mt-4">
                By placing your order, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default CheckoutForm;