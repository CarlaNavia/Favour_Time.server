const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const ServiceType = require("../models/ServiceType");
const Service = require("../models/Service");
const Booking = require("../models/booking");

const { isLoggedIn } = require("../helpers/middlewares");

//Ruta para crear un nuevo servicio
router.post("/newservice", isLoggedIn(), (req, res, next) => {
  Service.create({
    serviceName: req.body.serviceName,
    imageService: req.body.imageService,
    description: req.body.description,
    serviceType: req.body.serviceTypeID,
    availableTime: req.body.availableTime,
    cityToBeHeld: req.body.cityToBeHeld,
    addressToBeHeld: req.body.addressToBeHeld,
    streetNumberToBeHeld: req.body.streetNumberToBeHeld,
    credits: req.body.credits,
    owner: req.session.currentUser._id,
    bookings: [],
  })
    .then((newService) => {
      ServiceType.findByIdAndUpdate(
        req.body.serviceTypeID,
        { $push: { services: newService._id } },
        { new: true }
      )
        .then(() => {
          res.json(newService);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta donde encontramos todos los servicios sin filtrar. De momento no se está utilizando
router.get("/allservices", (req, res, next) => {
  Service.find()
    .populate("owner")
    .populate("serviceType")
    .then((allServices) => {
      res.json(allServices);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta buscar por texto
router.get("/searchservices", (req, res, next) => {
  let query = req.query.serviceName;
  Service.find({ serviceName: { $regex: query, $options: "i" } })
    .populate("owner")
    .populate("serviceType")
    .then((searchedByText) => {
      res.json(searchedByText);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta editar servicio
router.put("/services/:id", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Service.findById(req.params.id)
    .then((oneService) => {
      if (!oneService.owner.equals(req.session.currentUser._id)) {
        res.status(400).json({
          message: "You are not the owner, you cannot edit the service",
        });
        return;
      }
      Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
        (theService) => {
          res.json(theService);
        }
      );
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta detalle del servicio
router.get("/services/:serviceID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.serviceID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Service.findById(req.params.serviceID)
    .populate("serviceType")
    .populate("owner")
    .then((serviceDetails) => {
      res.status(200).json(serviceDetails);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta GET de servicios para el owner / PROFILE 5
router.get("/servicesOwner/:userID", isLoggedIn(), (req, res, next) => {
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
  Service.find({ owner: req.params.userID })
    .populate("clientBooking")
    .populate("ownerService")
    .populate("service")
    .then((serviceOfClient) => {
      res.json(serviceOfClient);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Ruta eliminar servicio
router.delete("/services/:id", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Service.findById(req.params.id)
    .then((oneService) => {
      if (!oneService.owner.equals(req.session.currentUser._id)) {
        res.status(400).json({
          message: "You are not the owner, you cannot delete the service",
        });
        return;
      }
      ServiceType.findByIdAndUpdate(
        oneService.serviceType,
        { $pull: { services: req.params.id } },
        { new: true }
      ).then((responseServiceType) => {
        Booking.deleteMany({
          service: req.params.id,
        }).then((responseBookings) => {
          Service.findByIdAndRemove(req.params.id).then(() => {
            res.json({
              message: `Service with ${req.params.id} is deleted successfully.`,
            });
          });
        });
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
