const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const ServiceType = require("../models/ServiceType");
const Service = require("../models/Service");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

// router.get('/servicetype', (req, res, next) => {
//     ServiceType.find()
//     .then(allServiceTypes => {
//         res.json(allServiceTypes);
//       })
//     .catch(err => {
//         res.json(err);
//       })
// });

//Ruta para crear un nuevo servicio
router.post("/newservice", isLoggedIn(), (req, res, next) => {
  Service.create({
    serviceName: req.body.serviceName,
    imageService: req.body.imageService,
    description: req.body.description,
    serviceType: req.body.serviceTypeID,
    availableTime: req.body.availableTime,
    addressToBeHeld: req.body.addressToBeHeld,
    credits: req.body.credits,
    owner: req.session.currentUser._id,
    bookings: [],
  })
    .then((response) => {
      ServiceType.findByIdAndUpdate(req.body.serviceTypeID, {
        $push: { services: response._id },
      })
        .then((theResponse) => {
          res.json(theResponse);
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
    .then((response) => {
      res.json(response);
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
    .then((response) => {
      if (!response.owner.equals(req.session.currentUser._id)) {
        res
          .status(400)
          .json({
            message: "You are not the owner, you cannot edit the service",
          });
        return;
      }
      Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
        (response) => {
          res.json(response);
        }
      );
    })
    .catch((err) => {
      res.json(err);
    });
});

// router.get('/services/:categoryID', (req, res, next)=>{
//     if(!mongoose.Types.ObjectId.isValid(req.params.categoryID)){
//     res.status(400).json({message: 'Specified id is not valid'});
//     return;
//     }

//     ServiceType.findById(req.params.categoryID).populate('services')
//     .then(response => {
//         res.status(200).json(response);
//     })
//     .catch(err => {
//         res.json(err);
//     })
// })

//Ruta detalle del servicio
router.get("/services/:serviceID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.serviceID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Service.findById(req.params.serviceID)
    .populate("servicesType")
    .then((response) => {
      res.status(200).json(response);
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
    //console.log(req.params.id, "SERVICE PARAMS ID")
      .then((response) => {
        //console.log("RESPONSE SERVICE", service)
        if (!response.owner.equals(req.session.currentUser._id)) {
          //console.log(response.owner, "OWNER")
          res
            .status(400)
            .json({
              message: "You are not the owner, you cannot delete the service",
            });
          return;
        }
        Service.findByIdAndRemove(req.params.id).then(
          (response) => {
            res.json({message: `Service with ${req.params.id} is deleted successfully.`});
          }
        );
      })
      .catch((err) => {
        res.json(err);
      });
  });

module.exports = router;
