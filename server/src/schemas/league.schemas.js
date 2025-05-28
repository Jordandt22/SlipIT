const Yup = require("yup");

// League Schema
const LeagueSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "League name is required.")
    .max(100, "League name exceeds 100 characters.")
    .required("League name is required."),
  startDate: Yup.date().min(new Date(), "Date must be after today."),
  endDate: Yup.date().min(new Date(), "Date must be after today."),
});

module.exports = { LeagueSchema };
