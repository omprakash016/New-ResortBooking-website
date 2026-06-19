const mongoose=require("mongoose");
const bookingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel"
  },

  checkIn: Date,

  checkOut: Date,

  totalPrice: Number,

  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }

}, { timestamps: true });

const bookingModel = mongoose.model("Booking", bookingSchema);
module.exports = bookingModel;