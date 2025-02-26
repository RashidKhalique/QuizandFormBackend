import path from "path";
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import Category from "../models/category.model.js";
import Quiz from "../models/Quiz.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const addcategory = async (req, res) => {
    const { categoryname } = req.body;

    
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    if (!categoryname) {
        return res.status(400).json({ message: "Category must have a name" });
    }

    try {
     
        
        const filePath = path.join(__dirname, "../public/temp", req.file.filename);
        const response = await uploadOnCloudinary(filePath);
        if (!response) {
            return res.status(500).json({ message: "Failed to upload to Cloudinary" });
        }

        const newCategory = await Category.create({
            categoryname,
            categoryimg: response.url,
            createdBy: req.user.id
        });

        res.status(200).json({
            message: "Category created successfully",
            category: newCategory,
            fileUrl: response.url,
        });
    } catch (error) {
        console.error("Error in category controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const showcategory = async (req, res) => {
  const id = req.user.id;
  try {
    let categories;
    if (req.user.role === "admin") {
      categories = await Category.find();
    } else {
      categories = await Category.find({ createdBy: id });
    }

    // If no categories found, return an error
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Category not Found" });
    }

    // Loop through each category and update with quiz count
    for (let category of categories) {
      const existquiz = await Quiz.find({ category: category.categoryname });
      const quizCount = existquiz.length;

      // Update each category with the quiz count
      await Category.updateOne(
        { _id: category._id },
        { $set: { quiz: quizCount } }
      );
    }

    // Send back the categories with updated quiz counts
    res.status(200).json({
      success: true,
      message: "Data Retrieved Successfully",
      category: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
    console.log(error);
  }
};



  const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        let category;
        category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not Found" });
        }

        const categoryQuizzes = await Quiz.find({ category: category.categoryname });

        if (req.user.role === "admin") {
            const deleteResult = await Category.deleteOne({ _id: id });
            if (deleteResult.deletedCount === 0) {
                return res.status(404).json({ message: "Category not Found" });
            }

       
            if (categoryQuizzes.length > 0) {
                const quizDeleteResult = await Quiz.deleteMany({ category: category.categoryname });
                if (quizDeleteResult.deletedCount === 0) {
                    console.log("No quizzes were deleted.");
                }
            }

            return res.status(200).json({ success: true, message: "Category and Associated Quizzes Deleted Successfully" });
        } else {
            if (category.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ message: "Forbidden: You can only delete your own categories" });
            }

            const deleteResult = await Category.findByIdAndDelete(id);
            if (!deleteResult) {
                return res.status(404).json({ message: "Category not Found" });
            }

        
            if (categoryQuizzes.length > 0) {
                const quizDeleteResult = await Quiz.deleteMany({ category: category.categoryname });
                if (quizDeleteResult.deletedCount === 0) {
                    console.log("No quizzes were deleted.");
                }
            }

            return res.status(200).json({ success: true, message: "Category and Associated Quizzes Deleted Successfully" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};

  
 
  

export default { addcategory , showcategory , deleteCategory };
