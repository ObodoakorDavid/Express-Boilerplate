import ApiError from "../utils/apiError.js";

const methodNotAllowed = (req, res) => {
  return ApiError.methodNotAllowed(
    `Method ${req.method} not allowed on ${req.originalUrl}`
  );
};

export default methodNotAllowed;
