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


//rutas get

//aceptar/declinar

router.post("/booking/:serviceID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.serviceID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Service.findById(req.params.serviceID)
  .then((response) => {
    if (response.owner.equals(req.session.currentUser._id)) {
      res.status(400).json({
        message: "You are not allowed due to you are the owner of the service.",
      });
      return;
    }
    Booking.create({
      date: req.body.date,
      time: req.body.time,
      client: req.session.currentUser._id,
      owner: req.body.owner,
      status: req.body.status,
      service: req.body.service,
    })

      .then((response) => {
        Service.findByIdAndUpdate(req.body.service, { $push: { bookings: response._id }})
          .then((theResponse) => {
            res.json(theResponse);
            console.log(theResponse, "THERESPONSEEEEEEE")
          })
          .catch((err) => {
            res.json(err);
          });
          res.json(response)
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

