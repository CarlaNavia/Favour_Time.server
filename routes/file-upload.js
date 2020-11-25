const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Service = require("../models/Service");
const mongoose = require('mongoose');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

const uploader = require("../configs/cloudinary-setup");

router.post(
  "/upload",
  uploader.single("file"),
  isLoggedIn(),
  async (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      { imageProfile: req.file.secure_url },
      { new: true }
    );

    // get secure_url from the file object and save it in the
    // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    res.json(updatedUser);
  }
);

router.post(
  "/uploadservice/:serviceId",
  uploader.single("file"),
  isLoggedIn(),
  async (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.serviceId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    const servicesImage = await Service.findByIdAndUpdate(
      req.params.serviceId,
      { imageService: req.file.secure_url },
      { new: true }
    );

    res.json(servicesImage);
  }
);

module.exports = router;
