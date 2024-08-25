import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    products:[{
        type: mongoose.ObjectId,
        ref:"products"
    }],
    payment:{

    },
    buyer:{
        type: mongoose.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        enum:["pending","processing","shipped","delivered","canceled"],
        default:"pending"
        },
    
},{
    timestamps:true
});
export default mongoose.model("order",orderSchema);