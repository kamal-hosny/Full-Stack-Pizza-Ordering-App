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
import { Extra, ProductSize, Size } from "@prisma/client";
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
    item.Size.find((size) => size.name === ProductSize.SMALL) ||
    item.Size[0];

  const defaultExtras =
    cart.find((element) => element.id === item.id)?.extras || [];

  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras);

  let totalPrice = item.basePrise;
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }

  const handleAddToCart = () => {
    dispatch(
      addCartItem({
        basePrice: item.basePrise,
        id: item.id,
        image: item.image,
        name: item.name,
        size: selectedSize,
        extras: selectedExtras,
      })
    );
  };

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
              sizes={item.Size}
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
            Total: {formatCurrency(totalPrice)}
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
                className="bg-primary hover:bg-primary/90 px-8 py-2 font-medium text-white"
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
  selectedSize: Size;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
}) {
  return (
    <RadioGroup defaultValue={selectedSize.id} className="grid grid-cols-3 gap-3">
      {sizes.map((size: Size) => (
        <div
          key={size.id}
          className="border rounded-lg p-3 transition-all hover:border-primary cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <RadioGroupItem
              id={size.id}
              className="h-5 w-5 text-primary"
              value={size.id}
              checked={selectedSize.id === size.id}
              onClick={() => setSelectedSize(size)}
            />
            <Label htmlFor={size.id} className="mt-2 font-medium text-gray-800">
              {size.name}
            </Label>
            <p className="text-primary font-semibold mt-1">
              {formatCurrency(size.price + item.basePrise)}
            </p>
          </div>
        </div>
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
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      const filteredSelectedExtras = selectedExtras.filter(
        (item) => item.id !== extra.id
      );
      setSelectedExtras(filteredSelectedExtras);
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };

  return (
    <div className="space-y-2">
      {extras.map((extra: Extra) => (
        <div
          key={extra.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <Checkbox
              id={extra.id}
              onClick={() => handleExtra(extra)}
              checked={Boolean(selectedExtras.find((e) => e.id === extra.id))}
              className="mr-3 h-5 w-5"
            />
            <Label htmlFor={extra.id} className="font-medium text-gray-800">
              {extra.name}
            </Label>
          </div>
          <span className="text-primary font-medium">
            {formatCurrency(extra.price)}
          </span>
        </div>
      ))}
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
  selectedSize: Size;
  item: ProductWithRelations;
}) {
  const dispatch = useAppDispatch();
  const totalPrice = item.basePrise + selectedSize.price + selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => dispatch(removeCartItem({ id: item.id }))}
        >
          -
        </Button>
        <div>
          <span className="text-black">{quantity} in cart</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              addCartItem({
                basePrice: item.basePrise,
                id: item.id,
                image: item.image,
                name: item.name,
                extras: selectedExtras,
                size: selectedSize,
              })
            )
          }
        >
          +
        </Button>
      </div>
      <div className="text-lg font-bold text-gray-800">
        Total: {formatCurrency(totalPrice * quantity)}
      </div>
      <Button
        size="sm"
        onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
      >
        Remove
      </Button>
    </div>
  );
}