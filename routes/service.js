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
            ServiceType.findByIdAndUpdate(req.body.serviceTypeID, {$push: {services: response._id}})
            .then(theResponse => {
                res.json(theResponse);
            })
            .catch(err => {
                res.json(err);
            })
        })
        .catch(err => {
            res.json(err);
        });
        });

        router.get('/allservices', (req, res, next) => {
            Service.find().populate('owner').populate('serviceType')
            .then(allServices => {
                res.json(allServices);
              })
            .catch(err => {
                res.json(err);
              })
        });

        router.get('/searchservices', (req, res, next) => {
            let query = req.query.serviceName
            Service.find({ serviceName: { $regex: query, $options: "i" } }).populate('owner').populate('serviceType')
            .then(response => {
                res.json(response);
              })
            .catch(err => {
                res.json(err);
              })
        });

        router.get('/services/:categoryID', (req, res, next)=>{
            if(!mongoose.Types.ObjectId.isValid(req.params.categoryID)){
            res.status(400).json({message: 'Specified id is not valid'});
            return;
            }
    
            ServiceType.findById(req.params.categoryID).populate('services')
            .then(response => {
                res.status(200).json(response);
            })
            .catch(err => {
                res.json(err);
            })  
        })

        router.get('/services/:categoryID/:serviceID', isLoggedIn(), (req, res, next)=>{
            if(!mongoose.Types.ObjectId.isValid(req.params.serviceID)){
            res.status(400).json({message: 'Specified id is not valid'});
            return;
            }
    
            Service.findById(req.params.serviceID).populate('servicesType')
            .then(response => {
                res.status(200).json(response);
            })
            .catch(err => {
                res.json(err);
            })  
        })

        

module.exports = router;