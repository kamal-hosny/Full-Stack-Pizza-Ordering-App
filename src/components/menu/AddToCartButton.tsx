"use client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { Checkbox } from "@/components/ui/checkbox";
import { Extra, Size } from "@prisma/client";
import { ProductSizes } from "@prisma/client";
import { ProductWithRelations } from "@/types/product";
import {
  addCartItem,
  removeCartItem,
  removeItemFromCart,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import { getItemQuantity } from "@/lib/cart";

const AddToCartButton = ({ item }: { item: ProductWithRelations }) => {
  const cart = useAppSelector(selectCartItems);
  const quantity = getItemQuantity(item.id, cart);
  const dispatch = useAppDispatch();


  const defaultSize =
    cart.find((element) => element.id === item.id)?.size ||
    item.sizes.find((size) => size.name === ProductSizes.SMALL) ||
    item.sizes[0];

  const defaultExtras =
    cart.find((element) => element.id === item.id)?.extras || [];

  const [selectedSize, setSelectedSize] = useState<Size | null>(defaultSize || null);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras);

  let totalPrice = item.basePrice;
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      // If no size is selected, we can't add to cart
      return;
    }
    
    dispatch(
      addCartItem({
        basePrice: item.basePrice,
        id: item.id,
        image: item.image,
        name: item.name,
        size: selectedSize,
        extras: selectedExtras,
      })
    );
  };

  // If no sizes are available, show a disabled button with a message
  if (item.sizes.length === 0) {
    return (
      <Button 
        disabled 
        className="bg-gray-400 text-white font-medium py-2 px-6 rounded-full shadow-md cursor-not-allowed"
      >
        No sizes available
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all">
          Add to Cart
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl border-0 bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="items-center text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {item.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center">
              <span className="bg-primary/10 text-primary p-1 rounded mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </span>
              Select Size
            </h3>
            <PickSize
              sizes={item.sizes}
              item={item}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>

          {/* Extras Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center">
              <span className="bg-primary/10 text-primary p-1 rounded mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </span>
              Add Extras
            </h3>
            <Extras
              extras={item.extras}
              selectedExtras={selectedExtras}
              setSelectedExtras={setSelectedExtras}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 text-lg font-bold text-gray-800">
            Total:  {formatCurrency(totalPrice * quantity)}
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-100 px-6"
              >
                Cancel
              </Button>
            </DialogClose>
            {quantity === 0 ? (
              <Button
                type="submit"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="bg-primary hover:bg-primary/90 px-8 py-2 font-medium text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add to cart {formatCurrency(totalPrice)}
              </Button>
            ) : (
              <ChooseQuantity
                quantity={quantity}
                item={item}
                selectedSize={selectedSize}
                selectedExtras={selectedExtras}
              />
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartButton;

function PickSize({
  sizes,
  item,
  selectedSize,
  setSelectedSize,
}: {
  sizes: Size[];
  item: ProductWithRelations;
  selectedSize: Size | null;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size | null>>;
}) {
  // Map size names to icons
  const sizeIcons = {
    SMALL: "🍕",
    MEDIUM: "🍕🍕",
    LARGE: "🍕🍕🍕",
    // Add more sizes as needed
  };

  // If no sizes available, show a message
  if (sizes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No sizes available for this item
      </div>
    );
  }

  return (
    <RadioGroup 
      defaultValue={selectedSize?.id || sizes[0]?.id} 
      className="grid grid-cols-3 gap-3"
    >
      {sizes.map((size: Size) => (
        <Label
        htmlFor={size.id}
          key={size.id}
          className={`border-2 rounded-xl p-3 transition-all cursor-pointer flex flex-col items-center
            ${selectedSize?.id === size.id 
              ? 'border-red-500 bg-red-50 shadow-md ring-2 ring-red-300 ring-opacity-50' 
              : 'border-amber-200 hover:border-amber-400'}`}
          onClick={() => setSelectedSize(size)}
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-1">
              {sizeIcons[size.name as keyof typeof sizeIcons] || "🍕"}
            </div>
            <RadioGroupItem
              id={size.id}
              className="h-5 w-5 text-red-600"
              value={size.id}
              checked={selectedSize?.id === size.id}
            />
            <div className="mt-1 font-bold text-gray-800">
              {size.name}
            </div>
            <p className="text-red-600 font-bold mt-1">
              +{formatCurrency(size.price)}
            </p>
            <p className="text-gray-600 text-xs mt-1">
              {formatCurrency(size.price + item.basePrice)}
            </p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}

function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
}) {
  const extraIcons: Record<string, string> = {
    cheese: "🧀",
    pepperoni: "🍖",
    mushrooms: "🍄",
    olives: "🫒",
    peppers: "🫑",
    onions: "🧅",

  };

  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(item => item.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {extras.map((extra: Extra) => {
        const extraKey = extra.name.toLowerCase();
        const icon = Object.keys(extraIcons).find(key => extraKey.includes(key)) 
          ? extraIcons[Object.keys(extraIcons).find(key => extraKey.includes(key))!]
          : "✨";

        return (
          <Label htmlFor={extra.id}
            key={extra.id}
            className={`flex items-center justify-between p-3 border-2 rounded-xl transition-colors
              ${selectedExtras.find(e => e.id === extra.id) 
                ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 ring-opacity-50' 
                : 'border-amber-100 hover:border-amber-300'}`}
          >
            <div className="flex items-center">
              <Checkbox
                id={extra.id}
                onClick={() => handleExtra(extra)}
                checked={Boolean(selectedExtras.find((e) => e.id === extra.id))}
                className="mr-3 h-5 w-5 text-amber-600"
              />
              <div className="font-medium text-gray-800 flex items-center">
                <span className="mr-2 text-lg">{icon}</span>
                {extra.name}
              </div>
            </div>
            <span className="text-amber-600 font-bold">
              +{formatCurrency(extra.price)}
            </span>
          </Label>
        );
      })}
    </div>
  );
}

function ChooseQuantity({
  quantity,
  item,
  selectedExtras,
  selectedSize,
}: {
  quantity: number;
  selectedExtras: Extra[];
  selectedSize: Size | null;
  item: ProductWithRelations;
}) {
  const dispatch = useAppDispatch();
  const totalPrice = item.basePrice + (selectedSize?.price || 0) + 
                    selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-red-50 p-3 rounded-xl border-2 border-amber-200 shadow-sm">
        <div className="flex items-center">
          <div className="bg-amber-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">
            {quantity}
          </div>
          <div>
            <div className="text-sm text-gray-600">In your cart</div>
            <div className="font-bold text-red-700">
              {formatCurrency(totalPrice * quantity)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-white p-1 rounded-full shadow-inner">
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:bg-red-50 w-8 h-8 rounded-full"
            onClick={() => dispatch(removeCartItem({ id: item.id }))}
          >
            <span className="text-lg">-</span>
          </Button>
          
          <div className="w-px h-6 bg-amber-200 mx-1"></div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 hover:bg-green-50 w-8 h-8 rounded-full"
            disabled={!selectedSize}
            onClick={() => {
              if (selectedSize) {
                dispatch(
                  addCartItem({
                    basePrice: item.basePrice,
                    id: item.id,
                    image: item.image,
                    name: item.name,
                    extras: selectedExtras,
                    size: selectedSize,
                  })
                );
              }
            }}
          >
            <span className="text-lg">+</span>
          </Button>
        </div>
      </div>
      
      <Button
        className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 font-bold py-3 transition-all group flex items-center justify-center"
        onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
      >
        <span className="flex items-center">
          Remove Pizza 
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:scale-110 transition-transform">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </span>
      </Button>
    </div>
  );
}