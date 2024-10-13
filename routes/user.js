const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true}),
  wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;
