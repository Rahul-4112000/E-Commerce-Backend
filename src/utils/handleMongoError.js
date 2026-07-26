import { ApiError } from "./apiError";

export const handleMongoError = (err) => {
  if (err.name === "ValidationError") {
    return new ApiError(400, err.message);
  }

  if (err.name === "CastError") {
    return new ApiError(400, "Invalid ID");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return new ApiError(409, `${field} already exists`);
  }

  return err;
};