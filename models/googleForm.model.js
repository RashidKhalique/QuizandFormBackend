import mongoose, { Schema } from "mongoose";

const googleFormSchema = new Schema({
  Form: {
    type: Object,
    required: true,  
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});


const googleForm = mongoose.model("googleForm", googleFormSchema);

export default googleForm;
