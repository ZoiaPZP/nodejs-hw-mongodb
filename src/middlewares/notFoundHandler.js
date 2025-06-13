import createError from "http-errors";

export const notFoundHandler = (req, res, next) => {
    console.log('Not found handler triggered for:', req.originalUrl);
  next(createError(404, "Route not found"));
};
  