import bcrypt from "bcryptjs"
import User from "../models/User.model.js";
import Quiz from "../models/Quiz.model.js";

import path from 'path';
import { fileURLToPath } from 'url';
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";



const delete_user = async(req,res)=>{
      const id = req.params.id;
      if(!id){
        res.status(404).json({
            message:"Id not Found"
        })
      }

      const existid = await User.deleteOne({ _id: id });
      if(!existid){
        res.status(401).json({message:"user not exist"})
      }
      res.status(200).json({
        success:true,
        message:"Successfully Delete"
      })

}



const update_user = async (req, res) => {
    const { name, email, password, role } = req.body;
    const id = req.params.id;
    const createdBy = req.user.id;
  

    if ([name, email, password, role].some((item) => !item || item.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Find and update the user
      const updateUser = await User.findByIdAndUpdate(id, { name, email, password,role, createdBy }, { new: true });
  
      if (!updateUser) {
        return res.status(401).json({ message: "User not found or not authenticated" });
      }

      if (password) {
        updateUser.password = await bcrypt.hash(password, 10);  
        await updateUser.save();
      }
  
  
      return res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "An error occurred while updating the user" });
    }
  };
  
  const showuser = async (req, res) => {
    const users = req.user;
    try {
      if (users.role === "admin") {
        const user = await User.find();
        return res.status(200).json({ 
          success: "true",
          message: "User fetched successfully",
          user
        });
      }
      
      const user = await User.find({ createdBy: req.user.id });
      return res.status(200).json({  
        success: "true",
        message: "User fetched successfully",
        user
      });
  
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users. Please try again later.' });
    }
  };
  
  const showMentor = async (req, res) => { 
    try {
        const mentors = await User.find({ role: "mentor" });
        
        if (!mentors || mentors.length === 0) {
            return res.status(400).json({ message: "No Mentor Found" });
        }

 
        const mentorQuizData = [];

  
        for (let mentor of mentors) {
            const quizzes = await Quiz.find({ createdBy: mentor._id });
            const totalQuiz = quizzes.length;

   
            mentorQuizData.push({
                mentor: mentor,
                totalQuiz: totalQuiz,
            });
        }

     
        res.status(200).json({
            success: true, 
            message: "Mentors retrieved successfully", 
            mentorQuizData
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
        console.log(error);
    }
};



const showuserQuizWithQuestions = async (req, res) => {
  try {
    const userId = req.user.id; 


    const userWithQuiz = await User.findById(userId);


    if (!userWithQuiz) {
      return res.status(404).json({ message: 'User not found' });
    }


    const quizIds = userWithQuiz.Quiz;


    if (quizIds.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this user' });
    }


    const quizzes = await Quiz.find({ '_id': { $in: quizIds } }).populate('questions');

    const filteredQuizzes = quizzes.map((quiz ,index) => {
      const score = userWithQuiz.Score;

      return {
        quizName: quiz.name, 
        score : score[index]
      };
    });


    return res.status(200).json({ user: userWithQuiz, quizzes: filteredQuizzes });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};







const adduser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const image = req.file;




  if (!image) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, "../public/temp", image.filename);

  try {

    const response = await uploadOnCloudinary(filePath);
    if (!response) {
      console.error('Cloudinary upload failed');
      return res.status(500).json({ message: "Failed to upload to Cloudinary" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      profilePic: response.url, 
      createdBy:req.user.id
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Added Successfully",
      newUser,
    });

  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Failed to add user. Please try again.' });
  }
};








  

export default { showuser ,delete_user,update_user,showMentor,showuserQuizWithQuestions,adduser }