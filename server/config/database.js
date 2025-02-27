// @ts-nocheck
const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected");
    }
    catch(error){
        console.log("database not connected: ", error);
    }
};

module.exports=connectDB;