import mongoose from "mongoose";
import Quiz from "../models/Quiz.model.js";
import User from "../models/User.model.js";
import LeaderPort from "../models/LeaderPort.js"

const alldata = async (req, res) => {
    const createdByid = req.user.id;
    const createdByrole = req.user.role;


    try {
         const result = await Quiz.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(createdByid)  // Fix: Use new to instantiate ObjectId
                }
            },
            {
                $group: {
                    _id: "$createdBy",  // Group by createdBy field
                    categories: { $addToSet: "$category" },
                    totalQuizzes: { $sum: 1 },
                    totalQuestions: { $sum: { $size: "$questions" } }
                }
            },
            {
                $project: {
                    totalCategories: { $size: "$categories" },
                    totalQuizzes: 1,
                    totalQuestions: 1,
                }
            }
        ]);

      
        const allusers = await User.aggregate([
            {
                $match: { createdBy: createdByrole } 
            },
            {
                $group: {
                    _id: null, 
                    totalcanidate: { $sum: 1 }  
                }
            },
            {
                $project: {
                    totalcanidate: 1  // Project the total user count
                }
            }
        ]);
        const quizData = result[0] || {};
        const userData = allusers[0] || {};

        const responseData = {
            totalCategories: quizData.totalCategories || 0,
            totalQuizzes: quizData.totalQuizzes || 0,
            totalQuestions: quizData.totalQuestions || 0,
            totalcanidate: userData.totalcanidate || 0
        };

        res.status(200).json({
            success: true,
            message: "Data Fetched Successfully",
            data: responseData
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const leadersboardall = async (req, res) => {
    const id = req.user.id
    try {
        let leadersboard= await LeaderPort.find();  
           
      if (leadersboard.length === 0) {
        return res.status(404).json({ message: "Leader Port has no data" });
      }       

      return res.status(200).json({ success: true, message: "Data retrieved successfully", data : leadersboard });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Error retrieving data", error: err.message });
    }
  };

  const leadersboardDelete = async (req, res) => {
    const id = req.params.id; 
    try {
      const leadersboard = await LeaderPort.findByIdAndDelete({ _id: id });
  
      if (!leadersboard) {
        return res.status(400).json({ message: "Quiz Record not Found" });
      }
  
      res.status(200).json({ success: true, message: "Record Deleted Successfully" });
  
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      console.log(error); 
    }
  };
  
  
  const userdashboard = async (req, res) => {
    try {
      const result = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.user.id) }
        },
        {
          $lookup: {
            from: "quizzes",
            localField: "Quiz",
            foreignField: "_id",
            as: "quizzes"
          }
        },
        {
          $lookup: {
            from: "leaderboards",
            localField: "_id",
            foreignField: "user",
            as: "quizScores"
          }
        },
        {
          $project: {
            name: 1,
            quizzes: 1,
            quizScores: 1,
            profilePic: 1 
          }
        },
        {
          $addFields: {
            totalQuizzes: { $size: "$quizzes" },
            completedQuizzes: { $size: "$quizScores" },
            currentQuiz: {
              $cond: [
                { $gt: [{ $size: "$quizScores" }, 0] },
                { $arrayElemAt: ["$quizzes", { $size: "$quizScores" }] },
                { name: "No current quiz" }
              ]
            },
        
          }
        },
        {
          $project: {
            name: 1,
            profilePic: 1,
            totalQuizzes: 1,
            completedQuizzes: 1,
            currentQuiz: 1,
            lastAttempted: 1,
            totalScore: 1,  
            quizScores: {
              $map: {
                input: "$quizScores",
                as: "score",
                in: {
                  name: "$$score.quiz.name",
                  score: "$$score.correct_Answer",
                  percentage: "$$score.percentage",
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$$score.createdAt" } }
                }
              }
            }
          }
        }
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json(result[0]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  
  






export default { alldata , leadersboardall,leadersboardDelete,userdashboard};