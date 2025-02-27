import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();


cloudinary.config({ 
            cloud_name: process.env.cloudinary_cloud_name,
            api_key: process.env.cloudinary_api_key,
            api_secret: process.env.cloudinary_api_secret 
        });


        

        const uploadOnCloudinary = async (localFilePath) =>{
            try {
                if(!localFilePath) return null;
               const response = await cloudinary.uploader.upload_stream(localFilePath, {
                    resource_type : "auto"
                })
                console.log("File uploade Successfully", response.url);
                return response
            } catch (error) {
                console.error("Error uploading file to Cloudinary:", error.message);
                fs.unlinkSync(localFilePath);
                return null;
            }
        }
        
 export {uploadOnCloudinary}
