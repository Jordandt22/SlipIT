const {
  errorCodes: { YUP_ERROR },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");

const validator = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { valid: true, errors: null };
  } catch (err) {
    const errors = {};
    for (const e of err.inner) {
      if (!errors[e.path]) {
        const pathList = e.path.split(".");
        errors[pathList[pathList.length - 1]] = e.message;
      }
    }
    return { valid: false, errors };
  }
};

module.exports = {
  bodyValidator: (schema) =>
    serverErrorCatcherWrapper(async (req, res, next) => {
      const { valid, errors } = await validator(schema, req.body);
      if (valid && !errors) {
        return next();
      }

      res.status(422).json(customErrorHandler(YUP_ERROR, errors));
    }),
  paramsValidator: (schema) =>
    serverErrorCatcherWrapper(async (req, res, next) => {
      const { valid, errors } = await validator(schema, req.params);
      if (valid && !errors) {
        return next();
      }

      res.status(422).json(customErrorHandler(YUP_ERROR, errors));
    }),
  queryValidator: (schema) =>
    serverErrorCatcherWrapper(async (req, res, next) => {
      const { valid, errors } = await validator(schema, req.query);
      if (valid && !errors) {
        return next();
      }

      res.status(422).json(customErrorHandler(YUP_ERROR, errors));
    }),
};
