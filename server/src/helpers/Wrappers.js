const {
  errorCodes: { SERVER_ERROR },
  customErrorHandler,
} = require("./customErrorHandler");

module.exports = {
  serverErrorCatcherWrapper: (controller) => {
    return async function (req, res, next) {
      try {
        return await controller.call(this, req, res, next);
      } catch (e) {
        return res
          .status(500)
          .json(
            customErrorHandler(
              SERVER_ERROR,
              "Sorry, there was an error with the server."
            )
          );
      }
    };
  },
};
