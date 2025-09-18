"use server";
import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { updateProfileSchema } from "@/validations/profile";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  isAdmin: boolean,
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  
  // Extract data properly from FormData
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const streetAddress = formData.get("streetAddress") as string;
  const postalCode = formData.get("postalCode") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const imageFile = formData.get("image") as File;
  
  // Debug logging
  console.log("=== PROFILE UPDATE DEBUG ===");
  console.log("Image file received:", imageFile);
  console.log("Image file size:", imageFile?.size);
  console.log("Image file type:", imageFile?.type);
  console.log("Image file name:", imageFile?.name);
  console.log("Is image file valid:", imageFile instanceof File);
  console.log("FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
  const data = {
    name,
    email,
    phone,
    streetAddress,
    postalCode,
    city,
    country,
    image: imageFile,
  };
  
  const result = updateProfileSchema(translations).safeParse(data);

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
    };
  }
  
  const validatedData = result.data;
  
  // Handle image upload
  let imageUrl: string | undefined;
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await getImageUrl(imageFile);
      console.log("Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      return {
        message: "Failed to upload image. Please try again.",
        status: 500,
        formData,
      };
    }
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });
    if (!user) {
      return {
        message: translations.messages.userNotFound,
        status: 401,
        formData,
      };
    }
    
    // Prepare update data
    const updateData = {
      name: validatedData.name,
      phone: validatedData.phone,
      streetAddress: validatedData.streetAddress,
      postalCode: validatedData.postalCode,
      city: validatedData.city,
      country: validatedData.country,
      role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      ...(imageUrl && { image: imageUrl }), // Only update image if we have a new URL
    };
    
    console.log("Updating user with data:", updateData);
    
    await db.user.update({
      where: {
        email: user.email,
      },
      data: updateData,
    });
    revalidatePath(`/${locale}/${Routes.PROFILE}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`
    );
    return {
      status: 200,
      message: translations.messages.updateProfileSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

const getImageUrl = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "profile_images");

  // Debug logging
  console.log("Starting image upload...");
  console.log("File size:", imageFile.size);
  console.log("File type:", imageFile.type);
  console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const uploadUrl = `${baseUrl}/api/upload`;
  console.log("Upload URL:", uploadUrl);

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error:", errorText);
      throw new Error(`Upload failed with status: ${response.status} - ${errorText}`);
    }
    
    const image = (await response.json()) as { url: string };
    console.log("Upload response:", image);
    
    if (!image.url) {
      throw new Error("No URL returned from upload");
    }
    
    return image.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
