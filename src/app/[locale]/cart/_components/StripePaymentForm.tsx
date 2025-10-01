'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { FaCreditCard, FaSpinner } from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast";

type CartTrans = typeof import("@/dictionaries/en.json")["cart"];

interface StripePaymentFormProps {
  orderId: string;
  totalAmount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  trans?: CartTrans;
}

const StripePaymentForm = ({ orderId, totalAmount, onPaymentSuccess, onPaymentError, trans }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      toast({
        title: "جاري إنشاء نية الدفع...",
        description: "يرجى الانتظار بينما نقوم بإنشاء نية الدفع",
      });

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      toast({
        title: "جاري معالجة الدفع...",
        description: "يرجى الانتظار بينما نقوم بمعالجة الدفع",
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-xl bg-white">
        <CardElement options={cardElementOptions} />
      </div>
      
      <Button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" />
            {trans?.checkout.stripeProcessing || 'Processing Payment...'}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaCreditCard />
            {(trans?.checkout.stripePay || 'Pay')} ${totalAmount.toFixed(2)}
          </div>
        )}
      </Button>
    </div>
  );
};

export default StripePaymentForm;
