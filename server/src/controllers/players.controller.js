const uuid = require("uuid");
const PlayerModel = require("../models/player.model");

module.exports = {
  createPlayer: async (req, res, next) => {
    const { playerInfo } = req.body;
    const newPlayer = await PlayerModel.create({
      playerID: uuid.v4(),
      playerInfo,
    });

    res.status(200).json({ player: newPlayer });
  },
};
