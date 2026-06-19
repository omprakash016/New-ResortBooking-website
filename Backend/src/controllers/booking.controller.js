const Booking = require("../models/booking");
const Hotel = require("../models/listings");



// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {

    const {
      checkIn,
      checkOut
    } = req.body;

    const hotel =
      await Hotel.findById(
        req.params.hotelId
      );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }
    const bookings =
      await Booking.find({
        user: req.user.id
      }).populate("status");
      if(bookings.some(booking=>booking.status==="booked" && booking.hotel.toString()===hotel._id.toString())){
        return res.status(400).json({
          message:"You already have a booked booking"
        })
      }
    const days =
      Math.round((new Date(checkOut) -
        new Date(checkIn)) / 86400000);

    const totalPrice =
      days * hotel.price;

    const booking =
      await Booking.create({
        user: req.user.id,
        hotel: hotel._id,
        checkIn,
        checkOut,
        totalPrice
      });

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {

    const booking =
      await Booking.findById(
        req.params.bookingId
      );

       const bookings =
      await Booking.find({
        user: req.user.id
      }).populate("status");
      if(bookings.some(booking=>booking.status==="cancelled" && booking.hotel.toString()===hotel._id.toString())){
        return res.status(400).json({
          message:"You already have a cancelled booking"
        })
      }

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status =
      "cancelled";

    await booking.save();

    res.json({
      message: "Booking cancelled"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// GET MY BOOKINGS
exports.getMyBookings = async (req, res) => {
  try {

    const bookings =
      await Booking.find({
        user: req.user.id
      }).populate("hotel", "title price");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// GET OWNER BOOKINGS
exports.getOwnerBookings = async (req, res) => {
  try {
    // Find hotels owned by the user
    const hotels = await Hotel.find({ owner: req.user.id });
    const hotelIds = hotels.map(h => h._id);

    // Find bookings for those hotels
    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("hotel", "title price location")
      .populate("user", "name email");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE BOOKING STATUS BY OWNER
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed', 'cancelled', etc.
    const booking = await Booking.findById(req.params.bookingId).populate("hotel");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user owns the hotel
    if (booking.hotel.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated", booking });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};