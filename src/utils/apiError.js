class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = `ApiError [Status ${statusCode}]`;
    this.statusCode = statusCode;
    this.status = this.getStatusMessage(statusCode);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized(message) {
    return new ApiError(401, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static methodNotAllowed(message) {
    return new ApiError(405, message);
  }

  static unprocessableEntity(message) {
    return new ApiError(422, message);
  }

  static internalServerError(message) {
    return new ApiError(500, message);
  }

  static serviceUnavailable(message) {
    return new ApiError(503, message);
  }

  getStatusMessage(statusCode) {
    const statuses = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      422: "Unprocessable Entity",
      500: "Internal Server Error",
      503: "Service Unavailable",
    };
    return statuses[statusCode] || "Error";
  }
}

export default ApiError;
