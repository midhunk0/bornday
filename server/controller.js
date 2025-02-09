// @ts-nocheck
const { User, Bornday }=require("./model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const { returnUserId, getNextBornday } = require("./helper");
const sendEmail = require("./mail");

const jwt_secret=process.env.JWT_SECRET;
const jwt_expires_in="1d";

const generateOTP=()=>{
    return Math.floor(100000+Math.random()*900000).toString(); 
};

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
        const otp=generateOTP();
        const otpExpires=new Date(Date.now()+10*60*1000);
        const user=new User({
            username: username,
            email: email,
            password: hashedPassword,
            otp: otp,
            otpExpires: otpExpires,
            borndays: []
        });
        await user.save();
        const message=`Your verification code is: ${otp}`;
        await sendEmail(email, "Verify your email", message);
        const token=jwt.sign({ userId: user._id, username: user.username }, jwt_secret, { expiresIn: jwt_expires_in });
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24*60*1000 });
        return res.status(200).json({ message: "User registered. Check your email for the OTP" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const sendOTP=async(req, res)=>{
    try{
        const { email }=req.body;
        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }
        const user=await User.findOne({ email: email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const otp=generateOTP();
        const otpExpires=new Date(Date.now()+10*60*1000);
        user.otp=otp;
        user.otpExpires=otpExpires;
        await user.save();
        const message=`Your verification code is: ${otp}`;
        await sendEmail(email, "Verify your email", message);
        return res.status(200).json({ message: "OTP sends to email" });    
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const verifyOTP=async(req, res)=>{
    try{
        const { email, otp }=req.body;
        if(!email){
            return res.status(400).json({ message: "Enter the email" });
        }
        if(!otp){
            return res.status(400).json({ message: "Enter the OTP" });
        }
        const user=await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        if(user.otp!==otp){
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if(user.otpExpires<Date.now()){
            return res.status(400).json({ message: "OTP expired" });
        }
        user.isVerified=true;
        user.otp=undefined;
        user.otpExpires=undefined;
        await user.save();
        const token=jwt.sign({ userId: user._id, username: user.username }, jwt_secret, { expiresIn: jwt_expires_in });
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24*60*1000 });
        return res.status(200).json({ message: "User verified successfully" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

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
        if(!user.isVerified){
            return res.status(400).json({ message: "You are not verified", verified: false });
        }
        const passwordMatch=await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token=jwt.sign({ userId: user._id, username: user.username }, jwt_secret, { expiresIn: jwt_expires_in });
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24*60*10000 });
        return res.status(200).json({ message: "User login successful", user: user });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchUser=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(401).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("username email _id isVerified");
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User fetched", user });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const logoutUser=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const updateUser=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { username, email, oldPassword, newPassword }=req.body;
        let otpRequired=false, passwordChanged=false;
        if(username && username!==user.username){
            const usernameExist=await User.findOne({ username });
            if(usernameExist){
                return res.status(400).json({ message: "Username already taken" });
            }
            user.username=username;
        }
        if(email && email!==user.email){
            const emailExist=await User.findOne({ email });
            if(emailExist){
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email=email;
            otpRequired=true;
        }
        if(oldPassword && newPassword){
            const passwordMatch=await bcrypt.compare(oldPassword, user.password);
            if(!passwordMatch){
                return res.status(400).json({ message: "Incorrect password" })
            }
            if(oldPassword===newPassword){
                return res.status(400).json({ message: "New password cannot be the same as old password" });
            }
            user.password=await bcrypt.hash(newPassword, bcrypt.genSaltSync(12));
            passwordChanged=true;
        }
        if(otpRequired){
            const otp=generateOTP();
            user.otp=otp;
            user.otpExpires=new Date(Date.now()+10*60*1000);
            user.isVerified=false;
            const message=`Your verification code is: ${otp}`;
            await sendEmail(user.email, "Verify your email", message);
        }
        await user.save();
        if(otpRequired || passwordChanged){
            res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" });
        }
        return res.status(200).json({ message: otpRequired ? "User updated. Check your email for the OTP" : "User updated", verified: !otpRequired });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const deleteUser=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const deleteUser=await User.findByIdAndDelete(userId);
        if(!deleteUser){
            return res.status(400).json({ message: "User deletion failed" });
        }
        res.clearCookie("jwt", { maxAge: 1 });
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
            return res.status(400).json({ message: "User token not found or invalid" });
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
        return res.status(200).json({ message: "Borndays fetched", borndays: borndays });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchBornday=async(req, res)=>{
    try{
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
    registerUser,
    sendOTP,
    verifyOTP,
    loginUser,
    fetchUser,
    logoutUser,
    updateUser,
    deleteUser,
    addBornday,
    fetchBorndays,
    fetchBornday,
    fetchBorndaysByMonth,
    fetchBorndaysByDay,
    editBornday,
    deleteBornday,
}