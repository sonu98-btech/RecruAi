export class ApiResponse {
  static success(res, { statusCode = 200, message = "Success", data = null } = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, { message = "Created", data = null } = {}) {
    return ApiResponse.success(res, { statusCode: 201, message, data });
  }
}
