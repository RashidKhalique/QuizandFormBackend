import Quizcontroller from "../Controller/Quiz.controller.js"
import filterdata from "../Controller/FilteredData.controller.js"
import submitformdata from "../Controller/submitform.controller.js"
import verifytokenv from "../Middlewear/auth.middlewear.js"
import { upload } from "../Middlewear/multer.middlewear.js"
import { Router } from "express"
const router = Router();

router.post("/create",verifytokenv,Quizcontroller.Create_Quiz)
 router.get("/showquiz",verifytokenv,Quizcontroller.show_quiz_all)
 router.get("/showquizone/:id",verifytokenv,Quizcontroller.show_quiz_one)
 router.get("/all",verifytokenv,filterdata.alldata)
router.put("/updateQuiz/:id",verifytokenv,Quizcontroller.update_quiz)
router.delete("/deleteQuiz/:id",verifytokenv,Quizcontroller.delete_quiz)
router.post("/submitAnswer/:id",verifytokenv,Quizcontroller.submitQuiz) 
router.get("/getLeaderportall",verifytokenv,filterdata.leadersboardall)
router.delete("/getLeaderportdelete/:id",filterdata.leadersboardDelete)
router.get("/userdashboard",verifytokenv, filterdata.userdashboard)

router.post("/submitForm",verifytokenv,upload.single("image"),submitformdata.submitForm)
router.get("/viewform/:id",submitformdata.viewform)
router.post("/createForm",verifytokenv,submitformdata.createForm)
router.get("/submitview/:id", verifytokenv,submitformdata.Submitionformview)
router.get("/viewdata",verifytokenv,submitformdata.viewdata)
router.get("/submitviewall",verifytokenv,submitformdata.Submitionformviewall)
router.delete("/deleteForm/:id",verifytokenv,submitformdata.deleteForm)
router.delete("/deleteresponse/:id",verifytokenv,submitformdata.deleteresponse)



export default router; 