import mongoose from "mongoose"
const categorySchema = ({
    categoryname:{
        type:String,
        required:true
    },
    categoryimg:{
        type:String,
        required:true
    },
    quiz:{
      type:String,
      required:true
    },
    createdBy: {
        type: String,
        default :"user"
      },
} )

const Category = mongoose.model("Category",categorySchema)

export default Category;



// createdBy , quiz , categoryimg , categoryname