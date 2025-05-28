const {
  errorCodes: { YUP_ERROR },
  customErrorHandler,
} = require("../helpers/customErrorHandler");

module.exports = {
  bodyValidator: (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = {};
      for (const e of err.inner) {
        if (!errors[e.path]) {
          errors[e.path] = e.message;
        }
      }
      res.status(422).json(customErrorHandler(YUP_ERROR, errors));
    }
  },
  paramsValidator: (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.params, { abortEarly: false });
      next();
    } catch (err) {
      const errors = {};
      for (const e of err.inner) {
        if (!errors[e.path]) {
          errors[e.path] = e.message;
        }
      }
      res.status(422).json(customErrorHandler(YUP_ERROR, errors));
    }
  },
};
