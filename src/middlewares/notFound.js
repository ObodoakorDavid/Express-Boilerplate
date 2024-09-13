import ApiError from "../utils/apiError.js";

const notFound = async (req, res, next) => {
  const notFoundError = ApiError.notFound("Route Not Found");
  next(notFoundError);
};

export default notFound;
