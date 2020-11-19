const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Booking = require("../models/Booking");
const Service = require("../models/Service");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//Ruta GET de bookings (client === user._id)
router.get("/bookings/:userID", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Booking.find({ client: req.params.userID })
    .populate("client")
    .populate("owner")
    .populate("service")
    .then((bookingsOfClient) => {
      res.json(bookingsOfClient);
    })
    .catch((err) => {
      res.json(err);
    });
});

//
//Ruta por POST para reservar un servicio
router.post("/bookings/:serviceID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.serviceID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Service.findById(req.params.serviceID)
    .then((currentService) => {
      if (currentService.owner.equals(req.session.currentUser._id)) {
        res.status(400).json({
          message:
            "You are not allowed due to you are the owner of the service.",
        });
        return;
      }
      Booking.create({
        date: req.body.date,
        time: req.body.time,
        client: req.session.currentUser._id,
        owner: currentService.owner,
        service: req.params.serviceID
      })

        .then((newBooking) => {
          Service.findByIdAndUpdate(req.params.serviceID, {
            $push: { bookings: newBooking._id },
          })
            .then(() => {
                res.json(newBooking);
            })
            .catch((err) => {
              res.json(err);
            });
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
