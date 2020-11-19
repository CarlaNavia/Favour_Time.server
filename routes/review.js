// const express = require("express");
// const mongoose = require("mongoose");
// const router = express.Router();

// const Booking = require("../models/Booking");
// const Service = require("../models/Service");
// const Review = require("../models/Review");

// // HELPER FUNCTIONS
// const {
//   isLoggedIn,
//   isNotLoggedIn,
//   validationLoggin,
// } = require("../helpers/middlewares");


// //Ruta por POST para crear una review
// router.post("/bookings/bookingID", isLoggedIn(), (req, res, next) => {
//     if (!mongoose.Types.ObjectId.isValid(req.params.bookingID)) {
//       res.status(400).json({ message: "Specified id is not valid" });
//       return;
//     }
//     Booking.findById(req.params.bookingID)
//       .then((currentBooking) => {
//         if (currentBooking.clientBooking.equals(req.session.currentUser._id)) {
//           res.status(400).json({
//             message:
//               "You are not allowed due to you are the create a review.",
//           });
//           return;
//         }
//         Booking.create({
//           date: req.body.date,
//           time: req.body.time,
//           clientBooking: req.session.currentUser._id,
//           ownerService: currentService.owner,
//           service: req.params.serviceID
//         })
  
//           .then((newBooking) => {
//             Service.findByIdAndUpdate(req.params.serviceID, {
//               $push: { bookings: newBooking._id },
//             })
//               .then(() => {
//                   res.json(newBooking);
//               })
//               .catch((err) => {
//                 res.json(err);
//               });
//           })
//           .catch((err) => {
//             res.json(err);
//           });
//       })
//       .catch((err) => {
//         res.json(err);
//       });
//   });

//   module.exports = router;