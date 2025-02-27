// @ts-nocheck
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const returnUserId = require("../config/auth");
const { User } = require("../model");
const { getNextBornday } = require("../utils/dateUtils");

const addBornday=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { name, date }=req.body;
        if(!name){
            return res.status(400).json({ message: "Name required" });
        }
        if(!date){
            return res.status(400).json({ message: "Date required" });
        }
        const file=req.file;
        let image;
        if(file){
            image={
                imageName: `${Date.now()}.${file.originalname}`,
                imageType: file.mimetype,
                image: file.buffer
            };
        }
        const bornday={
            name,
            date: new Date(date),
            image: image
        };
        user.borndays.push(bornday);
        await user.save();
        return res.status(200).json({ message: "Bornday added" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchImage=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        const { borndayId }=req.params;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const bornday=user.borndays.find(bornday=>bornday._id.toString()===borndayId);
        if(!bornday){
            return res.status(400).json({ message: "Bornday not found" });
        }
        if(!bornday.image){
            return res.status(200).send();
        }
        res.set("Content-Type",bornday.image.imageType);
        return res.status(200).send(bornday.image.image);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const fetchBorndays=async(req, res)=>{
    try{
        const apiUrl="http://localhost:4000";
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("borndays");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const today=new Date();
        const borndays=user.borndays.sort((a, b)=>{
            const nextA=getNextBornday(a.date, today);
            const nextB=getNextBornday(b.date, today);
            return nextA.getTime()-nextB.getTime();
        })
        const borndaysWithImage=borndays.map(bornday=>{
            const { image, ...borndayData }=bornday.toObject();
            return{
                ...borndayData,
                ...(image ? { imageUrl: `${apiUrl}/bornday/fetchImage/${bornday._id}` } : {}) 
            }
        })
        return res.status(200).json({ message: "Borndays fetched", borndays: borndaysWithImage });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBornday=async(req, res)=>{
    try{
        const apiUrl="http://localhost:4000"
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("borndays");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { borndayId }=req.params;
        const bornday=await user.borndays.find(bornday=>bornday._id.toString()===borndayId);
        if(!bornday){
            return res.status(400).json({ message: "Bornday not found" });
        }
        const {image, ...borndayData}=bornday.toObject();
        const borndayWithImage={
            ...borndayData,
            ...(image ? { imageUrl: `${apiUrl}/fetchImage/${bornday._id}` } : {}) 
        }
        return res.status(200).json({ message: "Bornday fetched", bornday: borndayWithImage });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBorndaysByMonth=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("borndays");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { month }=req.params;
        const filteredBorndays=user.borndays.filter(bornday=>{
            const borndayDate=new Date(bornday.date);
            return borndayDate.getMonth()+1===parseInt(month);
        });
        return res.status(200).json({ message: "Borndays fetched", borndays: filteredBorndays });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBorndaysByDay=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("borndays");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { day, month }=req.params;
        const filteredBorndays=user.borndays.filter(bornday=>{
            const borndayDate=new Date(bornday.date);
            return(
                borndayDate.getDate()===parseInt(day) &&
                borndayDate.getMonth()+1===parseInt(month)
            );
        });
        return res.status(200).json({ message: "Borndays fetched", borndays: filteredBorndays });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const editBornday=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("borndays");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { name, date }=req.body;
        const { borndayId }=req.params;
        const borndayIndex=user.borndays.findIndex(bornday=>bornday._id.toString()===borndayId);
        if(borndayIndex===-1){
            return res.status(400).json({ message: "Bornday not found" });
        }
        if(name){
            user.borndays[borndayIndex].name=name;
        }
        if(date){
            user.borndays[borndayIndex].date=date;
        }
        await user.save();
        return res.status(200).json({ message: "Bornday updated" })
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const deleteBornday=async(req, res)=>{
    try{
        const { borndayId }=req.params;
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        
        // const user=await User.findById(userId);
        // if(!user){
        //     return res.status(400).json({ message: "User not found" });
        // }
        // const borndayIndex=await user.borndays.findIndex(bornday=>bornday._id.toString()===borndayId);
        // if(borndayIndex===-1){
        //     return res.status(400).json({ message: "Bornday not found" });
        // }
        // user.borndays.splice(borndayIndex, 1);
        // await user.save();

        const user=await User.findByIdAndUpdate(
            userId,
            { $pull: { borndays: { _id: borndayId }}},
            { new: true }
        );

        return res.status(200).json({ message: "Bornday deleted successfully" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

module.exports={
    addBornday,
    fetchImage,
    fetchBorndays,
    fetchBornday,
    fetchBorndaysByMonth,
    fetchBorndaysByDay,
    editBornday,
    deleteBornday,
}