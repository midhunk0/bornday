const express=require("express");
const { addBornday, deleteBornday, fetchBorndays, fetchBorndaysByMonth, fetchBorndaysByDay, fetchBornday, editBornday, fetchImage }=require("../controllers/borndayController");
const router=express.Router();
const upload=require("../config/multer");

router.post("/addBornday", upload.single("image"), addBornday);
router.get("/fetchImage/:borndayId", fetchImage);
router.get("/fetchBorndays", fetchBorndays);
router.get("/fetchBornday/:borndayId", fetchBornday);
router.get("/fetchBorndaysByMonth/:month", fetchBorndaysByMonth);
router.get("/fetchBorndaysByDay/:day/:month", fetchBorndaysByDay);
router.put("/editBornday/:borndayId", upload.single("image"), editBornday);
router.delete("/deleteBornday/:borndayId", deleteBornday);

module.exports=router;