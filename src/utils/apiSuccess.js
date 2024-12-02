class ApiSuccess {
  constructor(statusCode, message, data = null) {
    this.success = true;
    this.status_code = statusCode;
    this.message = message;
    this.data = data;
  }

  static ok(message, data = null) {
    return new ApiSuccess(200, message, data);
  }

  static created(message, data = null) {
    return new ApiSuccess(201, message, data);
  }

  static noContent(message = "No content", data = null) {
    return new ApiSuccess(204, message, data);
  }

  static accepted(message, data = null) {
    return new ApiSuccess(202, message, data);
  }

  static resetContent(message = "Content reset", data = null) {
    return new ApiSuccess(205, message, data);
  }
}

export default ApiSuccess;
