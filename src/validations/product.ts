import { Translations } from "@/types/translations";
import { z } from "zod";

const imageValidation = (translations: Translations, isRequired: boolean) => {
  return !isRequired
    ? z.string().url().optional()
    : z.string().url({
        message:
          translations.admin["menu-items"].form.image.validation.required,
      });
};
const getCommonValidations = (translations: Translations) => {
  return {
    name: z.string().trim().min(1, {
      message: translations.admin["menu-items"].form.name.validation.required,
    }),
    description: z.string().trim().min(1, {
      message:
        translations.admin["menu-items"].form.description.validation.required,
    }),
    basePrice: z.string().min(1, {
      message:
        translations.admin["menu-items"].form.basePrice.validation.required,
    }).refine((val) => !isNaN(Number(val)), {
      message: "Base price must be a valid number",
    }),
    categoryId: z.string().min(1, {
      message:
        translations.admin["menu-items"].form.category.validation.required,
    }),
  };
};
export const addProductSchema = (translations: Translations) => {
  return z.object({
    ...getCommonValidations(translations),
    image: imageValidation(translations, true),
  });
};
export const updateProductSchema = (translations: Translations) => {
  return z.object({
    ...getCommonValidations(translations),
    image: imageValidation(translations, false),
  });
};
