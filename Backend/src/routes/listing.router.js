const  express=require('express');
const  router=express.Router();
const listingController=require("../controllers/listing.controller");
const multer=require('multer');
const { roleChecker } = require("../middleware/auth.middleware");
const upload=multer({storage:multer.memoryStorage()});





router.post("/create", roleChecker, upload.single("image"), listingController.createHotel);
router.get("/getHotels",listingController.getHotels);
router.delete("/delete/:id",roleChecker, listingController.deleteHotel);
router.put("/update/:id",roleChecker,upload.single("image"),listingController.updateHotel);

module.exports=router;