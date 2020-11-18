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
  //console.log(req.params.userID, "req.params.userid")
  Booking.find({ client: req.params.userID })
    .populate("client")
    .populate("owner")
    .populate("service")
    .then((response) => {
      console.log(response, "response");
      //console.log(response.client._id, "RESPONSE")
      //   if (!response.client.equals(req.session.currentUser._id)) {
      //     res.status(400).json({
      //       message: "Unfortunately you do not have any booking list",
      //     });

      res.json(response);
    })

    //   Service.findById(req.params.userID).then(
    //     (response) => {
    //       res.json( response);
    //     }
    //   );
    // })

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
    .then((response) => {
      if (response.owner.equals(req.session.currentUser._id)) {
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
        owner: response.owner,
        status: req.body.status,
        service: req.body.service,
      })

        .then((response) => {
          Service.findByIdAndUpdate(req.body.service, {
            $push: { bookings: response._id },
          })
            .then((theResponse) => {
              res.json(theResponse);
              console.log(theResponse, "THERESPONSEEEEEEE");
            })
            .catch((err) => {
              res.json(err);
            });
          res.json(response);
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
