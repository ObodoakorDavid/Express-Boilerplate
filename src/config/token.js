import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME || "1d",
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized("Token Expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized("Invalid Token");
    }

    throw ApiError.internalServerError("Internal Server Error");
  }
};
