import mongoose, { Schema } from "mongoose";

const LeaderboardSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
  email:{
   type : String,
   required:true
  },
  Quiz_name :{
    type :String,
     required:true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  correct_Answer: {
    type: String,
    required: true,
  },
  percentage: {
    type: String,
    required: true,
  },

 
  createdBy:{
    type : Schema.Types.ObjectId,
    ref :"Quiz"
  }
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);

export default Leaderboard;
