module.exports = {
  createPlayer: async (req, res, next) => {
    res.status(200).json({ msg: "Hello World" });
  },
};
