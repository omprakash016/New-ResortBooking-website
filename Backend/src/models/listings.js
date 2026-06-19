const  mongoose=require("mongoose");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    contact:{
        type:Number,
        required:true,

    },
    location:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});

const hotelModel=mongoose.model("Hotel",listingSchema);
module.exports=hotelModel ;