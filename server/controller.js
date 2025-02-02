// @ts-nocheck
const { User, Bornday }=require("./model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const returnUserId = require("./helper");

const jwt_secret=process.env.JWT_SECRET;
const jwt_expires_in="1hr";

const registerUser=async(req, res)=>{
    try{
        const { username, email, password }=req.body;
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const usernameExist=await User.findOne({ username: username });
        if(usernameExist){
            return res.status(400).json({ message: "Username already taken" });
        }
        const emailExist=await User.findOne({ email: email });
        if(emailExist){
            return res.status(400).json({ message: "Email is already in use" });
        }
        const hashedPassword=await bcrypt.hash(password, bcrypt.genSaltSync(12));
        const user=new User({
            username: username,
            email: email,
            password: hashedPassword,
            borndays: []
        });
        await user.save();
        const token=jwt.sign({ userId: user._id, username: user.username }, jwt_secret, { expiresIn: jwt_expires_in });
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 3600000 });
        return res.status(200).json({ message: "User created successfully" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const loginUser=async(req, res)=>{
    try{
        const { credential, password }=req.body;
        if(!credential || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user=await User.findOne({ $or: [{ email: credential }, { username: credential }]});
        if(!user){
            return res.status(400).json({ message: "User doesn't exists" });
        }
        const passwordMatch=await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token=jwt.sign({ userId: user._id, username: user.username }, jwt_secret, { expiresIn: jwt_expires_in });
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 3600000 });
        return res.status(200).json({ message: "User login successful" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const logoutUser=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found ot invalid" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        res.cookie("jwt", "", { maxAge: 1 });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const deleteUser=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found ot invalid" });
        }
        const deleteUser=await User.findByIdAndDelete(userId);
        if(!deleteUser){
            return res.status(400).json({ message: "User deletion failed" });
        }
        res.cookie("jwt", "", { maxAge: 1 });
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const addBornday=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found ot invalid" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { name, date }=req.body;
        const bornday={
            name: name,
            date: new Date(date)
        };
        user.borndays.push(bornday);
        await user.save();
        return res.status(200).json({ message: "Bornday added" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBorndays=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found ot invalid" });
        }
        const user=await User.findById(userId).select("borndays");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Borndays fetched", borndays: user.borndays });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBornday=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found ot invalid" });
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
        return res.status(200).json({ message: "Bornday fetched", bornday: bornday });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBorndaysByMonth=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found ot invalid" });
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
            return res.status(400).json({ message: "User token not found ot invalid" });
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
            return res.status(400).json({ message: "User token not found ot invalid" });
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
            return res.status(400).json({ message: "User token not found ot invalid" });
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
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    addBornday,
    fetchBorndays,
    fetchBornday,
    fetchBorndaysByMonth,
    fetchBorndaysByDay,
    editBornday,
    deleteBornday,
}