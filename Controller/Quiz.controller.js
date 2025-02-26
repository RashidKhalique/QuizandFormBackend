import Quiz from "../models/Quiz.model.js"
import Leaderboard from "../models/LeaderPort.js";
import mongoose from "mongoose";
import User from "../models/User.model.js";

const Create_Quiz = async (req, res) => {
  const {
    name,
    category,
    questions,
  } = req.body;

 


  const requiredFields = [name, category];
  if (requiredFields.some((item) => !item || typeof item !== 'string' || item.trim() === "")) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  try {

    const existquiz = await Quiz.findOne({ name, category });
    if (existquiz) {
      return res.status(400).json({ message: "A quiz with this name and category already exists." });
    }



    const formattedQuestions = [];

    for (const [index, q] of questions.entries()) {

      if (!q.choices || q.choices.length === 0) {
        return res.status(400).json({ success: false, message: `Question ${index + 1} must have at least one choice.` });
      }

      formattedQuestions.push({
        question: q.question || "",
        choices: q.choices || [],
        required: q.required !== undefined ? q.required : true,
        points: q.points || 1,
        time: q.time || 2,
        answer: q.answer || "",
        mcqs_type: q.type || "mcq"
      });
    }



    const newQuiz = new Quiz({
      name,
      category,
      questions: formattedQuestions,
      createdBy: req.user.id,
    });


    await newQuiz.save();


    return res.status(200).json({ success: true, message: "Quiz created successfully." });

  } catch (error) {
    console.error("Error occurred during quiz creation:", error);


    if (!res.headersSent) {
      return res.status(500).json({
        message: "An error occurred while creating the quiz.",
        error: error.message || error,
      });
    }
  }
};


const show_quiz_all = async (req, res) => {

  const id = req.user.id;
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Quiz Id is Required"
    })
  }
  try {
    let quiz;
    if(req.user.role === "admin")
      {
        quiz = await Quiz.find();
      } 
      else{
        quiz = await Quiz.find({ createdBy: id });
      }
   


    if (quiz.length === 0) {
      return res.status(400).json({ message: "Quiz not found." });
    }

    res.status(200).json({
      success: "true",
      message: "Quiz fetched successfully",
      quiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz. Please try again later.' });
  }
};



const show_quiz_one = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Quiz Id is Required"
    })
  }
  try {
    const quiz = await Quiz.find({ _id: id });

    if (quiz.length === 0) {
      return res.status(400).json({ message: "Quiz not found." });
    }

    res.status(200).json({
      success: "true",
      message: "Quiz fetched successfully",
      quiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz. Please try again later.' });
  }
};



const delete_quiz = async (req, res) => {
  const id = req.params.id;
  try {
    const exist = await Quiz.findByIdAndDelete(id)
  
    
    if (!exist) {
      return res.status(400).json({ message: "Quiz not found." })
    }
    res.status(200).json({ message: "Quiz deleted successfully." })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}



const update_quiz = async (req, res) => {
  const id = req.params.id;


  const { name,
    category,
    questions, } = req.body;


  if ([name,
    category].some((item) => !item || typeof item !== 'string' || item.trim() === "")) {
    return res.status(400).json({ message: "Please fill in all fields." })
  }
  try {
    const updatedquiz = await Quiz.findByIdAndUpdate(id, {
      name,
      category,
      questions,
    }
    )

    res.status(200).json({ success: true, message: "Quiz updated successfully." })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const submitQuiz = async (req, res) => {
  const { id } = req.params;  
  const { answer, questionId, isFinished, currentScore = 0 } = req.body;
  const userId = req.user.id;  

  if (!answer || !questionId || answer.trim() === "") {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found in the quiz" });
    }


    const existquiz = await Leaderboard.findOne({ quiz: id, user: userId });
    if (existquiz) {
      return res.status(400).json({ message: "You have already attempted the quiz" });
    }


    let updatedScore = currentScore;
    if (question.answer === answer.trim()) {
      updatedScore += 1;
    }

    const totalQuestions = quiz.questions.length;
    const percentage = (updatedScore / totalQuestions) * 100;

    if (isFinished === true) {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User not authenticated" });
      }

   
      const leaderboardEntry = new Leaderboard({
        quiz: id,
        Quiz_name: quiz.name,
        user: userId,
        email: req.user.email,
        correct_Answer: updatedScore,
        percentage: percentage,
        createdBy: quiz.createdBy
      });

      await leaderboardEntry.save();


      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            Quiz: id,
            Score: percentage, 
          }
        },
        { new: true, useFindAndModify: false }  
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Quiz completed successfully",
        score: updatedScore,
        percentage: percentage.toFixed(2),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Answer submitted successfully, continue to the next question",
      currentScore: updatedScore,
    });

  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({ message: "Server error" });
  }
};





export default { Create_Quiz, show_quiz_all, show_quiz_one, delete_quiz, update_quiz,submitQuiz }