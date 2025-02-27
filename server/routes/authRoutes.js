const express=require("express");
const { registerUser,verifyOTP, updateUser, fetchUser, sendOTP, loginUser, logoutUser, deleteUser}=require("../controllers/authController");
const router=express.Router();
const upload=require("../config/multer");

router.post("/registerUser", registerUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/loginUser", loginUser);
router.get("/fetchUser", fetchUser);
router.post("/logoutUser", logoutUser);
router.put("/updateUser", upload.single("image"), updateUser);
router.delete("/deleteUser", deleteUser);

module.exports=router;