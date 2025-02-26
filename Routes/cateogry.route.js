import verifytokenv from "../Middlewear/auth.middlewear.js"
import { Router } from "express"
import { upload } from "../Middlewear/multer.middlewear.js";
import categoryController from "../Controller/category.controller.js"
const router = Router()


router.post("/addcategory", upload.single("image"),  verifytokenv,categoryController.addcategory)
router.get("/showcategory",verifytokenv,categoryController.showcategory)
router.delete("/deletecategory/:id",verifytokenv,categoryController.deleteCategory)



export default router;