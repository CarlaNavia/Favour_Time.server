const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");
const mongoose = require("mongoose");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

router.post(
  "/signup",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { name, lastName, email, password } = req.body;

    try {
      const usernameExists = await User.findOne({ email }, "email");

      if (usernameExists) return next(createError(400));
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
          name,
          lastName,
          email,
          password: hashPass,
        });

        req.session.currentUser = newUser;
        res.status(200).json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).populate("review");

      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();

  res.status(204).send();
  return;
});

router.get("/private", isLoggedIn(), (req, res, next) => {
  res.status(200).json({ message: "User is logged in" });
});

router.get("/profile", isLoggedIn(), (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("review")
    .then((user) => {
      res.json(user);
    });
});

// Editar informacion personal del user / PROFILE 4
router.put("/profile/:userID", isLoggedIn(), (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(req.params.userID)
    .then((user) => {
      if (!user._id.equals(req.session.currentUser._id)) {
        res.status(400).json({
          message: "You are not the owner, you cannot edit this profile",
        });
        return;
      }
      User.findByIdAndUpdate(req.params.userID, req.body, { new: true }).then(
        (userUpdated) => {
      
          res.json(userUpdated);
        }
      );
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/buy", isLoggedIn(), (req, res, next) => {
  User.findByIdAndUpdate(
    req.session.currentUser._id,
    { $inc: { credits: req.body.credits } },
    { new: true }
  ).then((updatedUser) => {
    res.json(updatedUser);
  });
});

module.exports = router;
