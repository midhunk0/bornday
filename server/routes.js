const express=require("express");
const { registerUser, addBornday, loginUser, logoutUser, deleteUser, deleteBornday, fetchBorndays, fetchBorndaysByMonth, fetchBorndaysByDay, fetchBornday, editBornday } = require("./controller");
const router=express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/logoutUser", logoutUser);
router.delete("/deleteUser", deleteUser);
router.post("/addBornday", addBornday);
router.get("/fetchBorndays", fetchBorndays);
router.get("/fetchBornday/:borndayId", fetchBornday);
router.get("/fetchBorndaysByMonth/:month", fetchBorndaysByMonth);
router.get("/fetchBorndaysByDay/:day/:month", fetchBorndaysByDay);
router.put("/editBornday/:borndayId", editBornday);
router.delete("/deleteBornday/:borndayId", deleteBornday);

module.exports=router;