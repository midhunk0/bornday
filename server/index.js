const express=require("express");
const { graphqlHTTP }=require("express-graphql");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");

dotenv.config();
const app=express();
const port=4000;

app.use(cors());
app.use(express.json());

app.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`);
});