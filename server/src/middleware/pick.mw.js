const PickModel = require("../models/pick.model");
const {
  errorCodes: { PICK_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");

module.exports = {
  checkIfPickExists: serverErrorCatcherWrapper(async (req, res, next) => {
    const { pickID } = req.params;
    const pick = await PickModel.findOne({ pickID });
    if (!pick)
      return res
        .status(404)
        .json(
          customErrorHandler(
            PICK_NOT_FOUND,
            `Could NOT find pick with pickID: ${pickID}.`
          )
        );

    req.pick = pick;
    next();
  }),
};
