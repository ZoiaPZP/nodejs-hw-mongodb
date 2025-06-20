export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map(err => err.message).join(', ')
      });
    }

    next();
  };
};


