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
import { ProductWithRelations } from "@/types/product";


const sizes = [
  { id: crypto.randomUUID(), name: "Default", price: 0 },
  { id: crypto.randomUUID(), name: "Medium", price: 4 },
  { id: crypto.randomUUID(), name: "Large", price: 8 },
];

const extras = [
  { id: crypto.randomUUID(), name: "Cheese", price: 2 },
  { id: crypto.randomUUID(), name: "Onion", price: 4 },
  { id: crypto.randomUUID(), name: "Tomato", price: 8 },
];

const AddToCartButton = ({ item }: { item: ProductWithRelations }) => {
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
            <PickSize sizes={item.Size} item={item} />
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
            <Extras extras={item.extras} />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 text-lg font-bold text-gray-800">
            Total: {formatCurrency(item.basePrise)}
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
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-8 py-2 font-medium text-white"
            >
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartButton;

function PickSize({ sizes, item }: { sizes: Size[]; item: ProductWithRelations }) {
  console.log(sizes);

  return (
    <RadioGroup defaultValue="comfortable" className="grid grid-cols-3 gap-3">
      {sizes.map((size: Size) => (
        <div
          key={size.id}
          className="border rounded-lg p-3 transition-all hover:border-primary cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <RadioGroupItem
              value="default"
              id={size.id}
              className="h-5 w-5 text-primary"
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

function Extras({ extras }: { extras: Extra[] }) {
  return (
    <div className="space-y-2">
      {extras.map((extra: Extra) => (
        <div
          key={extra.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <Checkbox id={extra.id} className="mr-3 h-5 w-5" />
            <Label htmlFor={extra.id} className="font-medium text-gray-800">
              {extra.name}
            </Label>
          </div>
          <span className="text-primary font-medium">
            +{formatCurrency(extra.price)}
          </span>
        </div>
      ))}
    </div>
  );
}
