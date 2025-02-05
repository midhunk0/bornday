const express=require("express");
const { registerUser, addBornday, loginUser, logoutUser, deleteUser, deleteBornday, fetchBorndays, fetchBorndaysByMonth, fetchBorndaysByDay, fetchBornday, editBornday, verifyOTP, updateUser, fetchUser } = require("./controller");
const router=express.Router();

router.post("/registerUser", registerUser);
router.post("/verifyOTP", verifyOTP);
router.post("/loginUser", loginUser);
router.get("/fetchUser", fetchUser);
router.post("/logoutUser", logoutUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);
router.post("/addBornday", addBornday);
router.get("/fetchBorndays", fetchBorndays);
router.get("/fetchBornday/:borndayId", fetchBornday);
router.get("/fetchBorndaysByMonth/:month", fetchBorndaysByMonth);
router.get("/fetchBorndaysByDay/:day/:month", fetchBorndaysByDay);
router.put("/editBornday/:borndayId", editBornday);
router.delete("/deleteBornday/:borndayId", deleteBornday);

module.exports=router;