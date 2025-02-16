// @ts-nocheck
const express=require("express");
const cors=require("cors")
const cookieParser=require("cookie-parser");
const mongoose=require("mongoose");
const multer=require("multer");
require("dotenv").config();

const port=4000;
const app=express();
const environment=process.env.NODE_ENV;
const apiUrl=environment==='development' 
    ? process.env.FRONT_END_DEV_API
    : process.env.FRONT_END_PROD_API;

app.use(cors({
    origin: apiUrl,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorizarion"]
}));
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("database connected"))
    .catch((err)=>console.log("database not connected: ", err));

app.use("/", require("./routes"));

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})