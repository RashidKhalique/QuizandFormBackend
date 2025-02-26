import dbConnect from "./Dbconnect/dbConnect.js";
import userrouter from "./Routes/user.route.js";
import quizrouter from "./Routes/quiz.route.js"
import helmet from "helmet"; 
import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import  categoryroute from "./Routes/cateogry.route.js";
dotenv.config();
const app = express()
const port = 3000;
app.use(express.json())

app.use(helmet());



app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(cors({
    origin: "https://google-form-chi-ashy.vercel.app",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
}));
app.use(helmet());
dbConnect();
app.use("/api",userrouter)
app.use("/api/quiz",quizrouter) 
app.use("/api/category",categoryroute) 
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.get("/",async(req,res)=>{
    res.status(200).json({
        success : true,
        messsage:"Router is Working"
    })
})

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);  
})