import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).json({
      success: false,
      status: "Validation Error",
      status_code: 422,
      errors: [
        {
          field: errors.array()[0].path,
          message: errors.array()[0].msg,
        },
      ],
    });
  }
  next();
};

export const errorMiddleware = (err, req, res, next) => {
  process.env.NODE_ENV === "production" ? null : console.log(err);

  let status_code = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let status = err.status || "Error";

  const { code, keyValue } = err;

  if (code === 11000) {
    status_code = 409;
    const { email } = keyValue;
    if (email) {
      message = "User with this email already exists";
    }
  }

  if (err.name === "ValidationError") {
    status_code = 422;
    message = "Validation Error";
    const validationErrors = Object.keys(err.errors).map((field) => {
      return {
        field,
        message: err.errors[field].message,
      };
    });

    return res.status(status_code).json({
      success: false,
      status: "Validation Error",
      status_code,
      message,
      errors: validationErrors,
    });
  }

  res.status(status_code).json({
    success: false,
    status,
    status_code,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
