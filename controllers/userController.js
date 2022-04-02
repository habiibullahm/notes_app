const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const { User, PasswordReset } = require("../models");
const catchError = require("../utils/error")
const sendMail = require("../utils/sendMail")


module.exports = {
  register: async (req, res) => {
    const body = req.body;
    try {
        const check = await User.findOne({
          where: {
            email : body.email,
          },
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
            result: {},
          });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await User.create({
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" },
        );
        res.status(201).json({
          status: "Success",
          message: "Successfully to create an account",
          result: {
            token,
            user: {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              image: user.image,
            },
          },
        });
    } catch (error) {
      catchError(error, res);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email and password combination",
        });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email and password combination",
          result: {},
        });
      }
      const token = jwt.sign(
        {
          email: user.email,
          id: user.id,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        status: "Success",
        message: "Logged in successfully",
        result: {
          token,
          user: {
            fullName : user.fullName,
            email: user.email,
            image: user.image,
          },
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "email not found",
          result: {},
        });
      }
      const passwordReset = await PasswordReset.create({
        email,
        validationCode: randomstring.generate(50),
        isDone: false,
      });
      await sendMail(
        email,
        "Password Reset",
        `<h1>Password Reset Confirmation</h1>
        <a href="http://localhost:5000/reset-password?code=${passwordReset.validationCode}">Click Here</a>
        `,
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully sent validation code",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  resetPassword: async (req, res) => {
    const { validationCode, password } = req.body;
    try {
      const validate = await PasswordReset.findOne({
        where: {
          validationCode,
          isDone: false,
        },
      });
      if (!validate) {
        return res.status(404).json({
          status: "Not Found",
          message: "Invalid code validation",
          result: {},
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);

      await User.update(
        { password: hashPassword },
        { where: { email: validate.email } },
      );
      await PasswordReset.update(
        { isDone: true },
        {
          where: {
            validationCode,
          },
        },
      );

      res.status(200).json({
        status: "Success",
        message: "Successfully change the password",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  loginGoogle: async (req, res) => {
    try {
      let payload = {
        id: req.user.id,
        email: req.user.email,
      };
      const token = jwt.sign(payload, process.env.SECRET_TOKEN);
      res.status(200).json({
        status: "Success",
        message: "Successfully logged in",
        result: {
          token,
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
