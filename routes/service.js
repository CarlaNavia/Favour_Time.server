const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const ServiceType = require("../models/serviceType");
const Service = require("../models/service");

// HELPER FUNCTIONS
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin,
  } = require("../helpers/middlewares");

    router.get('/servicetype', (req, res, next) => {
        ServiceType.find()
        .then(allServiceTypes => {
            res.json(allServiceTypes);
          })
        .catch(err => {
            res.json(err);
          })
    });


    router.get('/services', (req, res, next) => {
        Service.find().populate('serviceType').populate('owner')
        .then(allTheServices => {
            res.json(allTheServices);
          })
        .catch(err => {
            res.json(err);
          })
        });


    router.post("/newservice", isLoggedIn(), (req, res, next) => {
        Service.create({
            serviceName: req.body.serviceName,
            imageService: req.body.imageService,
            description: req.body.description,
            serviceType: req.body.serviceTypeID,
            availableTime: req.body.availableTime,
            addressToBeHeld: req.body.addressToBeHeld,
            credits: req.body.credits,
            owner: req.session.currentUser._id
          })
            .then(response => {
              res.json(response);
            })
            .catch(err => {
              res.json(err);
            });
        });
    

module.exports = router;