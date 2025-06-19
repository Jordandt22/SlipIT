module.exports = {
  gameIDExtractor: (req, res, next) => {
    req.gameID = req.params.gameID;
    next();
  },
};
