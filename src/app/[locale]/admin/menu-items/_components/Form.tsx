"use client";

import FormFields from "@/components/form-fields/form-fields";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import SelectCategory from "./SelectCategory";
import { Category, Extra, Size } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ItemOptions, { ItemOptionsKeys } from "./ItemOptions";
import Link from "@/components/link";
import { useParams } from "next/navigation";
import { addProduct, deleteProduct, updateProduct } from "../_actions/product";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { ProductWithRelations } from "@/types/product";

function Form({
  translations,
  categories,
  product,
}: {
  translations: Translations;
  categories: Category[];
  product?: ProductWithRelations;
}) {
  const [selectedImage, setSelectedImage] = useState(
    product ? product.image : ""
  );
  const [categoryId, setCategoryId] = useState(
    product ? product.categoryId : categories[0].id
  );
  const [sizes, setSizes] = useState<Partial<Size>[]>(
    product ? product.sizes : []
  );
  const [extras, setExtras] = useState<Partial<Extra>[]>(
    product ? product.extras : []
  );
  const { getFormFields } = useFormFields({
    slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    translations,
  });

  // Remove the problematic formData initialization
  // The form will use the actual form data from the submission

  const initialState = {
    message: "",
    error: {} as Record<string, string[]>,
    status: 0,
    formData: null as FormData | null,
  };

  const [state, action, pending] = useActionState(
    product
      ? updateProduct.bind(null, {
          productId: product.id,
          options: { sizes, extras },
        })
      : addProduct.bind(null, { categoryId, options: { sizes, extras } }),
    initialState
  );

  useEffect(() => {
    console.log("=== FORM DEBUG ===");
    console.log("Form state:", state);
    console.log("Form pending:", pending);
    console.log("Selected image:", selectedImage);
    console.log("Category ID:", categoryId);
    console.log("Sizes:", sizes);
    console.log("Extras:", extras);
    console.log("==================");
    
    if (state.message && state.status && !pending) {
      console.log("Showing toast with message:", state.message);
      toast({
        title: state.message,
        className:
          state.status === 201 || state.status === 200
            ? "text-green-400"
            : "text-destructive",
      });
      
      // Reset form after successful submission
      if (state.status === 201) {
        console.log("Resetting form after successful submission");
        setSelectedImage("");
        setCategoryId(categories[0]?.id || "");
        setSizes([]);
        setExtras([]);
      }
    }
  }, [pending, state.message, state.status, selectedImage, categoryId, sizes, extras, categories, state]);
  return (
    <form key={state.status === 201 ? Date.now() : undefined} action={action} className="flex flex-col md:flex-row gap-10">
      <div>
        <UploadImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        {state?.error?.image && (
          <p className="text-sm text-destructive text-center mt-4 font-medium">
            {state.error?.image}
          </p>
        )}
        {/* Hidden input to send the image URL */}
        <input type="hidden" name="image" value={selectedImage} />
        {/* Hidden input to send the categoryId */}
        <input type="hidden" name="categoryId" value={categoryId} />
      </div>

      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          const fieldValue = state.formData?.get(field.name) ?? (product ? product[field.name as keyof ProductWithRelations] : "");

          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                error={state?.error || {} as Record<string, string[]>}
                defaultValue={fieldValue as string}
              />
            </div>
          );
        })}
        <SelectCategory
          categoryId={categoryId}
          categories={categories}
          setCategoryId={setCategoryId}
        />
        <AddSize
          translations={translations}
          sizes={sizes}
          setSizes={setSizes}
        />
        <AddExtras
          extras={extras}
          setExtras={setExtras}
          translations={translations}
        />
        <FormActions
          translations={translations}
          pending={pending}
          product={product}
        />
      </div>
    </form>
  );
}

export default Form;

const UploadImage = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [uploading, setUploading] = useState(false);
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        // Create preview URL
        const url = URL.createObjectURL(file);
        setSelectedImage(url);
        
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pathName", "product_images");
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          setSelectedImage(result.url);
        } else {
          console.error("Upload failed");
          setSelectedImage("");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setSelectedImage("");
      } finally {
        setUploading(false);
      }
    }
  };
  
  return (
    <div className="group mx-auto md:mx-0 relative w-[200px] h-[200px] overflow-hidden rounded-full">
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="Add Product Image"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      )}
      <div
        className={`${
          selectedImage
            ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
            : ""
        } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageChange}
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className={`border rounded-full w-[200px] h-[200px] element-center cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          ) : (
            <CameraIcon className="!w-8 !h-8 text-accent" />
          )}
        </label>
      </div>
    </div>
  );
};

const FormActions = ({
  translations,
  pending,
  product,
}: {
  translations: Translations;
  pending: boolean;
  product?: ProductWithRelations;
}) => {
  const { locale } = useParams();
  const [state, setState] = useState<{
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });
  const handleDelete = async (id: string) => {
    try {
      setState((prev) => {
        return { ...prev, pending: true };
      });
      const res = await deleteProduct(id);
      setState((prev) => {
        return { ...prev, status: res.status, message: res.message };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => {
        return { ...prev, pending: false };
      });
    }
  };
  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast({
        title: state.message,
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });
    }
  }, [pending, state.message, state.status]);
  return (
    <>
      <div
        className={`${product ? "grid grid-cols-2" : "flex flex-col"} gap-4`}
      >
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader />
          ) : product ? (
            translations.save
          ) : (
            translations.create
          )}
        </Button>
        {product && (
          <Button
            variant="outline"
            disabled={state.pending}
            onClick={() => handleDelete(product.id)}
          >
            {state.pending ? <Loader /> : translations.delete}
          </Button>
        )}
      </div>

      <Link
        href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translations.cancel}
      </Link>
    </>
  );
};

const AddSize = ({
  sizes,
  setSizes,
  translations,
}: {
  sizes: Partial<Size>[];
  setSizes: React.Dispatch<React.SetStateAction<Partial<Size>[]>>;
  translations: Translations;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4 "
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translations.sizes}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            optionKey={ItemOptionsKeys.SIZES}
            state={sizes}
            setState={setSizes}
            translations={translations}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const AddExtras = ({
  extras,
  setExtras,
  translations,
}: {
  extras: Partial<Extra>[];
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  translations: Translations;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-gray-100 rounded-md px-4 w-80 mb-4 "
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">
          {translations.extrasIngredients}
        </AccordionTrigger>
        <AccordionContent>
          <ItemOptions
            state={extras}
            optionKey={ItemOptionsKeys.EXTRAS}
            setState={setExtras}
            translations={translations}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
