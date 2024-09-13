import { body } from "express-validator";
import { handleValidationErrors } from "../../middlewares/error.js";

export const userValidator = [
  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 8 characters long"),

  body("phoneNumber")
    .exists()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone Number must be a string"),

  handleValidationErrors,
];
