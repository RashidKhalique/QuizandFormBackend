import mongoose from "mongoose";
import { type } from "os";
const FormSubmissionSchema = new mongoose.Schema({
  answers: {
    type: Object, 
    required: true,
  },
  submit: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  formid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'googleForm', 
    required: true,
  },
  QuizName: {
    type: String,
    default :"Untitled"
  },
  image:{
    type: String,
    default: ""
  },
  type:{
    type: String
  },
  submitby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'googleForm', 
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

 const FormSubmission = mongoose.model('FormSubmission', FormSubmissionSchema);

 export default FormSubmission