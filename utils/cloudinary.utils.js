import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});


console.log("Cloudinary Credentials:");
console.log("Cloud Name:", process.env.cloudinary_cloud_name);
console.log("API Key:", process.env.cloudinary_api_key);  // Be cautious with logging sensitive information
console.log("API Secret:", process.env.cloudinary_api_secret);  // Be cautious with logging sensitive information

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log(`Uploading file from path: ${localFilePath}`);

        // Measure upload start time
        const startTime = Date.now();

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detect file type (image, video, etc.)
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // in seconds

        console.log(`File uploaded successfully in ${duration} seconds: ${response.url}`);
        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error.message);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log(`Deleted local file: ${localFilePath}`);
        }

        return null;
    }
};

export { uploadOnCloudinary };
