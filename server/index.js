// @ts-nocheck
const express=require("express");
const cors=require("cors")
const cookieParser=require("cookie-parser");
const mongoose=require("mongoose");
const multer=require("multer");
require("dotenv").config();
const connectDB=require("./config/database");
const http=require("http");
const { Server }=require("socket.io");

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

connectDB();

app.use("/auth", require("./routes/authRoutes"));
app.use("/bornday", require("./routes/borndayRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));

const server=http.createServer(app);
const io=new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket)=>{
    console.log("User connected: ", socket.id);
    socket.on("disconnect", ()=>console.log("User disconnected"));
})

server.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})