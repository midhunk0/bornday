// @ts-nocheck
const jwt=require("jsonwebtoken");
const jwt_secret=process.env.JWT_SECRET;

const returnUserId=(req)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return null;
        }
        const decoded=jwt.verify(token, jwt_secret);
        return decoded.userId;
    }
    catch(err){
        return null;
    }
};

module.exports=returnUserId;