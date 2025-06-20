const PickModel = require("../models/pick.model");
const {
  errorCodes: { PICK_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { getCacheData, getPickKey, cacheData } = require("../redis/redis");

module.exports = {
  checkIfPickExists: serverErrorCatcherWrapper(async (req, res, next) => {
    const { pickID } = req.params;
    let pick;
    const { key, interval } = getPickKey(pickID);
    const cachedData = await getCacheData(key);
    if (cachedData) {
      pick = cachedData.pick;
    } else {
      pick = await PickModel.findOne({ pickID });
    }

    if (!pick)
      return res
        .status(404)
        .json(
          customErrorHandler(
            PICK_NOT_FOUND,
            `Could NOT find pick with pickID: ${pickID}.`
          )
        );

    // Cache Pick Data
    if (!cachedData) await cacheData(key, interval, { pick });
    req.pick = pick;
    next();
  }),
};
