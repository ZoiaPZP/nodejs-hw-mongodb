export const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const unused = next;
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({
    status,
    message,
    data: err.message,
  });
};




