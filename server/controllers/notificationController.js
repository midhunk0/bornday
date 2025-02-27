// @ts-nocheck
const returnUserId = require("../config/auth");
const { User } = require("../model");

const sendNotifications=async(req, res)=>{
    try{
        const tomorrow=new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        const formattedTomorrow=tomorrow.toISOString().split("T")[0];

        const users=await User.find({ "borndays.date": formattedTomorrow });

        for(const user of users){
            const upcomingBorndays=user.borndays.filter(
                (bornday)=>bornday.date.toISOString().split("T")[0]===formattedTomorrow
            );

            if(upcomingBorndays.length>0){
                const notifications=upcomingBorndays.map((bornday)=>({
                    message: `Tomorrow is ${bornday.name}'s bornday! 🎉`,
                    createdAt: new Date(),
                    isRead: false
                }));

                user.notifications.push(...notifications);
                await user.save();
            }
        }

        return res.status(200).json({ message: "Notifications schedules successfully" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const fetchNotifications=async(req, res)=>{
    try{
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("notifications");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const notifications=user.notifications.sort((a, b)=>{
            if(!a.isRead && b.isRead) return -1;
            if(a.isRead && !b.isRead) return 1;
            new Date(b.createdAt) - new Date(a.createdAt)
        })
        const count=user.notifications.filter((notification)=>!notification.isRead).length;
        if(!notifications){
            return res.status(400).json({ message: "There are no notifications" });
        }
        return res.status(200).json({ notifications, count });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const readNotification=async(req, res)=>{
    try{        
        const userId=returnUserId(req);
        if(!userId){
            return res.status(400).json({ message: "User token not found or invalid" });
        }
        const user=await User.findById(userId).select("notifications");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const { notificationId }=req.params;
        const notification=user.notifications.find((notification)=>notification._id.toString()===notificationId);
        if(!notification){
            return res.status(400).json({ message: "Notification not found" });
        }
        notification.isRead=true;
        await user.save();
        return res.status(200).json({ message: "Notification read" });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}


module.exports={
    sendNotifications,
    fetchNotifications,
    readNotification
}