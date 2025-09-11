
import { Button } from "@/components/ui/button";
import { deliveryFee, getSubTotal } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import { removeItemFromCart, selectCartItems } from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Trash2 } from "lucide-react";
import Image from "next/image";
const CartItems = () => {
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();
  const subTotal = getSubTotal(cart);

  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">Your Order</h2>
      {cart && cart.length > 0 ? (
        <>
          <ul className="space-y-6">
            {cart.map((item) => (
              <li 
                key={item.id}
                className="border-b pb-6 last:border-b-0 animate-fadeIn"
              >
                <div className='flex flex-col sm:flex-row gap-4 justify-between items-start'>
                  <div className='flex items-start gap-4'>
                    <div className='relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200'>
                      <Image
                        src={item.image}
                        className='object-cover'
                        alt={item.name}
                        fill
                      />
                    </div>
                    <div>
                      <h4 className='font-bold text-gray-900'>{item.name}</h4>
                      <div className="mt-1">
                        {item.size && (
                          <p className='text-sm text-gray-600'>
                            Size: <span className="text-gray-800 font-medium">{item.size.name}</span>
                          </p>
                        )}
                        {item.extras && item.extras.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">Extras:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.extras.map((extra) => (
                                <span 
                                  key={extra.id}
                                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                >
                                  {extra.name} (+{formatCurrency(extra.price)})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 justify-between w-full sm:w-auto'>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-gray-700 font-medium">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="text-gray-900 font-bold">
                        {formatCurrency(item.basePrice)}
                      </strong>
                      <Button
                        onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className='pt-6 space-y-3'>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="text-gray-900 font-medium">{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery:</span>
              <span className="text-gray-900 font-medium">{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 mt-2 text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span>{formatCurrency(subTotal + deliveryFee)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 max-w-md">
            Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill your cart!
          </p>
          <Button className="mt-6 bg-primary hover:bg-primary-dark">
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartItems;