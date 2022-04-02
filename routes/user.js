const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  loginGoogle,
  refreshToken,
  logout,
} = require("../controllers/userController");
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} = require("../helpers/joi-schema");
const { validate } = require("../middlewares/validator");

const passport = require("passport");
require("../helpers/passport");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.put("/token", refreshToken);
router.delete("/token", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  loginGoogle
);

module.exports = router;
