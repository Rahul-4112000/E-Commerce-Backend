import { logger } from "../utils/util";

export const requestLogger = (
  req,
  res,
  next
) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      query: req.query,
      params: req.params,
      body: req.body,
    });
  });

  next();
};