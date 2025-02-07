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
        return null
    }
};

const getNextBornday=(bornday, today)=>{
    const date=new Date(bornday);
    date.setFullYear(today.getFullYear());

    if(date.getMonth()<today.getMonth() || (date.getMonth()===today.getMonth() && date.getDate()<today.getDate())){
        date.setFullYear(today.getFullYear()+1);
    }
    return date;
}

module.exports={
    returnUserId,
    getNextBornday
};