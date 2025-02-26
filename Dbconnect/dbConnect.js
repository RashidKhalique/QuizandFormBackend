import { connect } from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const dbConnect= async ()=>{
const mongoUri = process.env.MONGODB_URI
   
 try{
    const Connection = await connect("mongodb+srv://rashidkhanjamali26:12345@googleform.5luqb.mongodb.net/")
    console.log("Database Connected Successfully");
 }
 catch(err){
    console.log("Connction Error : ",err);
    
 }
    
    
}

export default dbConnect;



// -Rashid Khalique (Mern Stack Modification Project Policies) All are Modified of DbConnect  Model