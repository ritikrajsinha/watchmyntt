import mongoose from "mongoose";

const categorieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        lowecase:true

    }
})
export default mongoose.model("category",categorieSchema);