import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //to remove the file after upload
const uploadOnCloudinary = async (filePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Click 'View API Keys' above to copy your Cloud Name
      api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API Key
      api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API Secret
    });
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath); // Remove the file if upload fails
    return res.status(500).json({
      message: "Cloudinary upload failed",
      error: error.message,
    });
  }
};

export default uploadOnCloudinary;
