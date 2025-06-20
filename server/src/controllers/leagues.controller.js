const uuid = require("uuid");
const LeagueModel = require("../models/league.model");
const {
  errorCodes: { LEAGUE_NAME_TAKEN },
  customErrorHandler,
} = require("../helpers/customErrorHandler");

module.exports = {
  createLeague: async (req, res, next) => {
    const { name, startingBalance, startDate, endDate } = req.body;

    // Check for Duplicate League Name
    const leagueNameAlreadyExists = await LeagueModel.exists({
      name,
    });
    if (leagueNameAlreadyExists)
      return res
        .status(422)
        .json(
          customErrorHandler(
            LEAGUE_NAME_TAKEN,
            "This league name is already taken."
          )
        );

    // Create League
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const league = await LeagueModel.create({
      leagueID: uuid.v4(),
      leagueInfo: {
        name,
        startingBalance,
        startDate: startDate ? startDate : today,
        endDate: endDate ? endDate : nextWeek,
      },
    });

    res.status(200).json({ data: { league }, error: null });
  },
};
