const express= require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app=express();
const authRouter=require("./routes/auth.router");
const hotelRouter=require("./routes/listing.router");
const bookingRouter=require("./routes/booking.auth");
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://new-resort-booking-website-ocxq.vercel.app/"
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.use("/api/auth",authRouter);

app.use("/api/hotel",hotelRouter);

app.use("/api/booking",bookingRouter);


module.exports=app;
