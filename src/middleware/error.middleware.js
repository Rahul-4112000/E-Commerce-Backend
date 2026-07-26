import { ApiError } from "../utils/apiError";
import { handleMongoError } from "../utils/handleMongoError";


export const errorHandler = (err, req, res, next) => {
  err = handleMongoError(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};