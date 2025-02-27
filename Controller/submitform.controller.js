import googleForm from '../models/googleForm.model.js';
import mongoose from 'mongoose';
import FormSubmission from '../models/FormSubmission.model.js';
import User from '../models/User.model.js';
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import path from "path";


const __dirname = path.dirname(fileURLToPath(import.meta.url));


const createForm = async (req, res) => {
  const Form = req.body;
  const userid = req.user.id;

  if (!Form) {
    return res.status(400).json({ message: "All data are required" });
  }
  try {

    const newForm = new googleForm({ Form, createdBy: userid });
    await newForm.save();

    res.status(200).json({ success: true, message: "Form data received and saved", data: newForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while processing the form" });
  }
};


const viewform = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {

    const googleForm2 = await googleForm.findById(id);

    if (!googleForm2) {
      return res.status(404).json({ message: "No Form data available" });
    }

    res.status(200).json({
      success: true,
      message: "Form data received and saved",
      data: googleForm2,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const submitForm = async (req, res) => {
  const { answers, submit, id } = req.body;
  const userId = req.user.id;  // Assuming the user id is available from req.user
  const file = req.file;
  console.log(req.file);

  // Validate the required fields
  if (!answers || !submit) {
    return res.status(400).json({ message: "Answers and submit status are required" });
  }

  try {
    // Find the form in the database
    const formToSubmit = await googleForm.findOne({ _id: id });
    if (!formToSubmit) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Check if the form has already been submitted (based on toggle)
    if (formToSubmit.Form.toggle) {
      const existingSubmission = await FormSubmission.findOne({ formid: id, user: userId });
      if (existingSubmission) {
        return res.status(400).json({ message: "Form already submitted" });
      }
    }

    // Default to the existing form's image URL
    let imageUrl = formToSubmit.Form.image;

    // If a file is uploaded, handle Cloudinary upload
    if (file) {
      const filePath = path.join(__dirname, "../public/temp", file.filename);

      // Ensure file is of the expected type and size
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files are allowed" });
      }

      const response = await uploadOnCloudinary(filePath);
      if (!response) {
        return res.status(500).json({ message: "Failed to upload to Cloudinary" });
      }

      // Set the image URL from the Cloudinary response
      imageUrl = response.secure_url;
      console.log("Cloudinary upload successful:", response);
    }

    // Determine the form type based on whether an image was uploaded
    const formType = imageUrl ? "file" : "text";

    // Create a new form submission entry
    const formSubmission = new FormSubmission({
      answers,
      submit,
      user: userId,
      formid: id,
      QuizName: formToSubmit.Form.quizTitle,
      submittedAt: new Date(),
      image: imageUrl,
      type: formType,
      submitby: formToSubmit.createdBy,
    });

    // Save the form submission to the database
    await formSubmission.save();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      data: formSubmission,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing the form submission",
      error: error.message,  
    });
  }
};




const Submitionformview = async (req, res) => {
  const user = req.user.id;
    
  const formid = req.params.id;

      
  try {
    const submitform = await FormSubmission.find({ _id:formid  ,submitby:user});
    if (!submitform || submitform.length === 0) {
      return res.status(400).json({ message: "Not Submitted Yet" });
    }

    res.status(200).json({ success: true, message: "Data Retrieved Successfully", submitform });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}


const viewdata = async (req, res) => {
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {

    const googleForm2 = await googleForm.find({ createdBy: id });
   
    if (!googleForm2) {
      return res.status(404).json({ message: "No Form data available" });
    }

    res.status(200).json({
      success: true,
      message: "Form data received and saved",
      data: googleForm2,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





const Submitionformviewall = async (req, res) => {
  const userId = req.user.id;

  try {
    const submitform = await FormSubmission.find(
      { submitby: userId },
      { submit: 1, QuizName: 1, submittedAt: 1, _id: 1, user: 1 }
    );

    if (!submitform.length) {
      return res.status(404).json({
        success: false,
        message: "No form submissions found for this user",
      });
    }

    const userNames = [];

    for (let i = 0; i < submitform.length; i++) {  
      let user = await User.findById(
        { _id: submitform[i].user },
        { name: 1 }
      );

      const userName = user ? user.name : "Unknown User";
      userNames.push(userName);
      submitform[i].user = userName;
    }

    res.status(200).json({
      success: true,
      message: "Data Retrieved Successfully",
      submitform,
      userNames,  
    });

  } catch (error) {
    console.error("Error fetching submitted data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const deleteForm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const formToDelete = await googleForm.findById(id);
    if (!formToDelete) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (formToDelete.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this form" });
    }
    

    await googleForm.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the form" });
  }
};



const deleteresponse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const responseToDelete = await FormSubmission.findById(id);
    if (!responseToDelete) {
      return res.status(404).json({ message: "Response not found" });
    }

    if (responseToDelete.submitby.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this response" });
    }

    await FormSubmission.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Response deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the response" });
  }
}


export default { submitForm, viewform, createForm, Submitionformview, viewdata , Submitionformviewall,deleteForm,deleteresponse};
