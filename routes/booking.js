const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");

const { isLoggedIn } = require("../helpers/middlewares");

//Ruta GET de bookings (client === user._id)   PROFILE 1
router.get("/clientbooking/:userID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  if (req.session.currentUser._id !== req.params.userID) {
    res.status(400).json({
      message: "You are not allowed due to you are the owner of the service.",
    });
    return;
  }
  Booking.find({ clientBooking: req.params.userID })
    .populate("clientBooking")
    .populate("ownerService")
    .populate("service")
    .then((bookingsOfClient) => {
      res.json(bookingsOfClient);
    })
    .catch((err) => {
      res.json(err);
    });
});
//Ruta GET de bookings (currentUser === ownerService) PROFILE 2
router.get("/ownerservice/:userID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  if (req.session.currentUser._id !== req.params.userID) {
    res.status(400).json({
      message: "You are not allowed due to you are the owner of the service.",
    });
    return;
  }
  Booking.find({ ownerService: req.params.userID })
    .populate("clientBooking")
    .populate("ownerService")
    .populate("service")
    .then((bookingsOfClient) => {
      res.json(bookingsOfClient);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta GET para tener una booking
router.get("/booking/:bookingId", isLoggedIn(), async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    const thisBooking = await Booking.findById(req.params.bookingId)
    .populate("ownerService")
    .populate("service")
    res.json(thisBooking);
  } catch (err) {
    res.status(400).json(err);
  }
});
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
      if (currentService.credits > req.session.currentUser.credits) {
        res.status(400).json({
          message: "You don't have enough credits to book this service.",
        });
        return;
      }
      Booking.create({
        date: req.body.date,
        time: req.body.time,
        extraInformation: req.body.extraInformation,
        clientBooking: req.session.currentUser._id,
        ownerService: currentService.owner,
        service: req.params.serviceID,
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

// Ruta por PUT para cambiar el estado del booking
router.put(
  "/bookings/:bookingId/:status",
  isLoggedIn(),
  async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    try {
      const booking = await Booking.findById(req.params.bookingId);
      if (req.session.currentUser._id != booking.ownerService) {
        res.status(400).json({
          message:
            "You are not allowed due to you are the owner of the service.",
        });
        return;
      }
      if (
        req.params.status !== "accepted" &&
        req.params.status !== "declined" &&
        req.params.status !== "pending"
      ) {
        res.status(400).json({
          message: "This status is not allowed.",
        });
        return;
      }

      const updateStatus = await Booking.findByIdAndUpdate(
        req.params.bookingId,
        { status: req.params.status },
        { new: true }
      ).populate("service");
      if (req.params.status === "accepted") {
        await User.findByIdAndUpdate(
          req.session.currentUser._id,
          { $inc: { credits: updateStatus.service.credits } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          booking.clientBooking,
          { $inc: { credits: -updateStatus.service.credits } },
          { new: true }
        );
      }

      res.json(updateStatus);
    } catch (error) {
      res.status(500).json({
        message: "There was an error.",
      });
    }
  }
);
module.exports = router;
