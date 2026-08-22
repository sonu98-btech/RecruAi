import { ApiError } from "../utils/ApiError.js";

export function validate(schemaFn) {
  return (req, _res, next) => {
    const errors = schemaFn(req);
    if (errors.length) {
      return next(ApiError.badRequest("Validation failed", errors.join("; ")));
    }
    next();
  };
}
