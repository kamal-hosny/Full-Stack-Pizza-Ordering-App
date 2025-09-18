import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

// Define the type for the form data file
type FormDataFile = Blob & {
    name?: string; // Optional: Some browsers may add this
}

export async function POST(request: Request) {
    try {
        console.log("Upload API called");
        const formData = await request.formData();
        const file = formData.get("file") as FormDataFile | null;
        const pathName = formData.get("pathName") as string;

        console.log("File received:", !!file);
        console.log("File size:", file?.size);
        console.log("File type:", file?.type);
        console.log("Path name:", pathName);

        if (!file) {
            console.log("No file provided");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }
        
        // Convert the file to a format Cloudinary can handle (Buffer or Base64)
        const fileBuffer = await file.arrayBuffer();
        const base64File = Buffer.from(fileBuffer).toString("base64");
        
        console.log("File converted to base64, length:", base64File.length);
        console.log("Cloudinary config:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? "***" : "missing",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "missing"
        });
        
        // Upload to Cloudinary
        console.log("Starting Cloudinary upload...");
        console.log("Upload options:", {
            folder: pathName,
            fileType: file.type,
            base64Length: base64File.length
        });
        
        const uploadResponse = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64File}`,
            {
                folder: pathName,
                transformation: [
                    { width: 200, height: 200, crop: "fill", gravity: "face" },
                ],
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                } else {
                    console.log("Cloudinary upload result:", result);
                }
            }
        )
        
        if (!uploadResponse || !uploadResponse.secure_url) {
            throw new Error("No URL returned from Cloudinary upload");
        }
        
        console.log("Cloudinary upload successful:", uploadResponse.secure_url);
        return NextResponse.json({ url: uploadResponse.secure_url });

    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        });
        return NextResponse.json(
            { 
                error: "Failed to upload image",
                details: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

