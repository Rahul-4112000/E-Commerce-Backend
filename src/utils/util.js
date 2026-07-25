import winston from "winston";
export const buildPaginationMetaData = ({ page, limit, itemCount }) => {
  const totalPage = Math.ceil(itemCount / limit);

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPage;

  return {
    page,
    count: itemCount,
    limit,
    totalPage,
    hasPreviousPage,
    hasNextPage
  }
}

export const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [
    // Terminal
    new winston.transports.Console(),

    // File
    new winston.transports.File({
      filename: "logs/app.log",
    }),
  ],
});