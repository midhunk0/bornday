// @ts-nocheck
const { User } = require("../model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const sendEmail = require("../services/emailService");
const returnUserId = require("../config/auth");

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
            borndays: [],
            notifications: []
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
        return res.status(200).json({ message: "User login successful"});
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

const fetchUser=async(req, res)=>{
    try{
        const apiUrl="http://localhost:4000";
        const userId=returnUserId(req);              
        if(!userId){
            return res.status(401).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("username email _id isVerified");
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }
        const { profileImage, ...userData}=user.toObject();
        const userWithProfileImage={
            ...userData,
            ...(profileImage ? { imageUrl: `${apiUrl}/fetchImage/${user._id}` } : {})
        }
        return res.status(200).json({ message: "User fetched", user: userWithProfileImage });
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

module.exports={
    registerUser,
    sendOTP,
    verifyOTP,
    loginUser,
    fetchUser,
    logoutUser,
    updateUser,
    deleteUser
}