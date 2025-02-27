const express=require("express");
const { fetchNotifications, readNotification, sendNotifications }=require("../controllers/notificationController");
const router=express.Router();

router.post("/sendNotifications", sendNotifications);
router.get("/fetchNotifications", fetchNotifications);
router.put("/readNotification/:notificationId", readNotification)

module.exports=router;