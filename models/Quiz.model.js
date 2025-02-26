import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const questionSchema = new mongoose.Schema({
    question: String,
    choices: [String],
    required: Boolean,
    points: Number,
    time: Number,
    answer: String,
    mcqs_type: String
  });
  
  const quizSchema = new mongoose.Schema({
    name: String,
    category: String,
    questions: [questionSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
    
  });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;

