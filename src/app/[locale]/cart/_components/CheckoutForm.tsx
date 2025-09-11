
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getTotalAmount } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import { selectCartItems } from "@/redux/features/cart/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { FaLock, FaUser, FaHome, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

const CheckoutForm = () => {
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment successful! Thank you for your purchase.");
    }, 2000);
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
              <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                name="name"
                className="py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
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
                className="py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
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
                className="py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
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
                  className="py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
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
                  className="py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
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
                  className="py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-700 font-bold">Total:</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
              </div>
              
              <Button 
                className="w-full py-6 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <FaLock className="mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
              
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