const Yup = require("yup");

// Player Schema
const PlayerSchema = Yup.object({
  jobDetails: Yup.object({
    name: Yup.string().min(3).max(100).required(),
    desc: Yup.string().min(1).max(300).required(),
    slurmFile: Yup.string().min(1).max(20).required(),
  }).required(),
  data: Yup.object().required(),
});

module.exports = { PlayerSchema };
