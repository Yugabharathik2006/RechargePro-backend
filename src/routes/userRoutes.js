const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const googleAuthController = require("../controllers/googleAuthController");

// Local Auth Routes
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// Google OAuth Routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleAuthController.googleCallback
);

// Google token login (for frontend Google Sign-In)
router.post("/google/token", googleAuthController.googleTokenLogin);

module.exports = router;