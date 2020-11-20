const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Booking = require("../models/booking");
const Service = require("../models/service");
const User = require("../models/user");

const { isLoggedIn } = require("../helpers/middlewares");

//Ruta GET de bookings (client === user._id)   PROFILE 1
router.get("/clientbooking/:userID", isLoggedIn(),(req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  if (req.session.currentUser._id !== req.params.userID) {
    res.status(400).json({
      message:
        "You are not allowed due to you are the owner of the service.",
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
      message:
        "You are not allowed due to you are the owner of the service.",
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
        extraInformation: req.body.extraInformation,
        clientBooking: req.session.currentUser._id,
        ownerService: currentService.owner,
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
// Ruta por POST para cambiar el estado del booking 
router.put("/bookings/:ownerServiceID/:clientBooking/:bookingId/:status", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  if (req.session.currentUser._id !== req.params.ownerServiceID) {
    res.status(400).json({
      message:
        "You are not allowed due to you are the owner of the service.",
    });
    return;
  }
  
  Booking.findById(req.params.bookingId)
    .then((currentBooking) => {
        if(req.params.status === "accepted"){
          Booking.findByIdAndUpdate(req.params.bookingId ,{status: "accepted"} , {new: true})
          .then(response =>{
            Service.findById(response.service._id)
            .then(responseCredits =>{
              User.findByIdAndUpdate( req.session.currentUser._id, {$inc : {credits : responseCredits.credits}}, {new: true})
              .then(responseOwner =>{
                User.findByIdAndUpdate( req.params.clientBooking, {$inc : {credits : -responseCredits.credits}}, {new: true})
                .then(responseClient =>{
                  res.json(response)
                })
              })
              .catch(error =>{
                res.json(error)
              })
            })
          })
        }else{
          Booking.findByIdAndUpdate(req.params.bookingId ,{status: "declined"} , {new: true})
          .then(response =>{
          res.json(response)
          })
        }
    }) 
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
