import authController from "../Controller/auth.controller.js"
import Quizcontroller from "../Controller/Quiz.controller.js"
import UserController from "../Controller/User.controller.js"
import verifytokenv from "../Middlewear/auth.middlewear.js"
import { upload } from "../Middlewear/multer.middlewear.js";
import { Router } from "express"
const router = Router()


router.post("/signup",authController.signup)
router.post("/login", authController.login)
router.get("/showuser", verifytokenv, UserController.showuser)
router.put("/updateUser/:id",verifytokenv, UserController.update_user)
router.delete("/userDelete/:id",UserController.delete_user)
router.get("/showmentor",verifytokenv,UserController.showMentor)
router.get("/Quizdata",verifytokenv,UserController.showuserQuizWithQuestions)
router.post("/adduser",verifytokenv,upload.single('image'),UserController.adduser)

export default router;