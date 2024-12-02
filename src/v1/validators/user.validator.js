import { body } from "express-validator";
import { handleValidationErrors } from "../../middlewares/error.js";
import ApiError from "../../utils/apiError.js";

export const userValidator = [
  body("firstName")
    .exists()
    .withMessage("firstName is required")
    .isString()
    .withMessage("firstName must be a string"),

  body("lastName")
    .exists()
    .withMessage("lastName is required")
    .isString()
    .withMessage("lastName must be a string"),

  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),

  body("phoneNumber")
    .exists()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone Number must be a string"),

  body("roles")
    .exists()
    .withMessage("roles is required")
    .isArray()
    .withMessage("Roles must be an array of strings")
    .custom((value) => {
      const validRoles = ["user", "admin"];
      if (value.length > 1) {
        throw ApiError.unprocessableEntity("User can only have one role");
      }
      value.forEach((role) => {
        if (!validRoles.includes(role)) {
          throw ApiError.unprocessableEntity("Invalid Role");
        }
      });
      return true;
    }),

  handleValidationErrors,
];
