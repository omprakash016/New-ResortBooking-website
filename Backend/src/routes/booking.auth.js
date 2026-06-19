const express=require('express');
const  router=express.Router();
const bookingController=require("../controllers/booking.controller");
const { bookingAuth, authMiddleware } = require("../middleware/auth.middleware");

router.post("/create/:hotelId", bookingAuth, bookingController.createBooking);
router.delete("/cancel/:bookingId", bookingAuth, bookingController.cancelBooking);
router.get("/myBookings", bookingAuth, bookingController.getMyBookings);
router.get("/ownerBookings", authMiddleware, bookingController.getOwnerBookings);
router.put("/updateStatus/:bookingId", authMiddleware, bookingController.updateBookingStatus);

module.exports=router;