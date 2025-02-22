const cron=require("node-cron");
const { User }=require("./model");

const scheduleNotifications=()=>{
    cron.schedule("52 17 * * *", async()=>{
        try {
            console.log("Running bornday notification job...");

            const tomorrow=new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            const formattedTomorrow=tomorrow.toISOString().split("T")[0];

            const users=await User.find({ "borndays.date": formattedTomorrow });

            for(const user of users){
                const upcomingBorndays=user.borndays.filter(
                    (bornday)=>bornday.date.toISOString().split("T")[0]===formattedTomorrow
                );

                if (upcomingBorndays.length>0){
                    const notifications=upcomingBorndays.map((bornday)=>({
                        message: `Tomorrow is ${bornday.name}'s bornday! 🎉`,
                        createdAt: new Date(),
                        isRead: false,
                    }));

                    user.notifications.push(...notifications);
                    await user.save(); 
                    console.log(`Notifications created for user ${user.username}:`, notifications);
                }
            }
        } 
        catch(err){
            console.error("Error in cron job:", err);
        }
    });
};

module.exports=scheduleNotifications;
