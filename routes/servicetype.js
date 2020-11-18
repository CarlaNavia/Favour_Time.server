const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const ServiceType = require("../models/ServiceType");

router.get("/servicetype", (req, res, next) => {
  ServiceType.find()
    .then((allServiceTypes) => {
      res.json(allServiceTypes);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/servicetype/:categoryID", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.categoryID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ServiceType.findById(req.params.categoryID)
    .populate("services")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
