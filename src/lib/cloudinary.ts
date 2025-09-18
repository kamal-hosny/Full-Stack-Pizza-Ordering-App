import { v2 as cloudinary } from "cloudinary";

// Fix for environment variables with trailing commas
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.replace(/[",]/g, '') || "dizj9rluo";
const apiKey = process.env.CLOUDINARY_API_KEY?.replace(/[",]/g, '') || "487446136287761";
const apiSecret = process.env.CLOUDINARY_API_SECRET?.replace(/[",]/g, '') || "Vyg_9H-ZtluolOzbQffcdfqlHUA";

console.log("Cloudinary config:", {
  cloud_name: cloudName,
  api_key: apiKey ? "***" : "missing",
  api_secret: apiSecret ? "***" : "missing"
});

try {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  console.log("Cloudinary configured successfully");
} catch (error) {
  console.error("Error configuring Cloudinary:", error);
}

export default cloudinary;
