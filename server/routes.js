const express=require("express");
const { registerUser, addBornday, loginUser, logoutUser, deleteUser, deleteBornday, fetchBorndays, fetchBorndaysByMonth, fetchBorndaysByDay, fetchBornday, editBornday, verifyOTP, updateUser, fetchUser, sendOTP, fetchImage, fetchNotifications, readNotification, sendNotifications } = require("./controller");
const router=express.Router();
const upload=require("./config");

router.post("/registerUser", registerUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/loginUser", loginUser);
router.get("/fetchUser", fetchUser);
router.post("/logoutUser", logoutUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);
router.post("/addBornday", upload.single("image"), addBornday);
router.get("/fetchImage/:borndayId", fetchImage);
router.get("/fetchBorndays", fetchBorndays);
router.get("/fetchBornday/:borndayId", fetchBornday);
router.get("/fetchBorndaysByMonth/:month", fetchBorndaysByMonth);
router.get("/fetchBorndaysByDay/:day/:month", fetchBorndaysByDay);
router.put("/editBornday/:borndayId", editBornday);
router.delete("/deleteBornday/:borndayId", deleteBornday);
router.post("/sendNotifications", sendNotifications);
router.get("/fetchNotifications", fetchNotifications);
router.put("/readNotification/:notificationId", readNotification)

module.exports=router;