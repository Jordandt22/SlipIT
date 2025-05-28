const Yup = require("yup");

// League Schema
const LeagueSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "League name is required.")
    .max(100, "League name exceeds 100 characters.")
    .required("League name is required."),
  startingBalance: Yup.number()
    .min(10, "The minimum starting balance is 10.")
    .max(1000, "The max starting balance is 1000.")
    .required("A starting balance is required."),
  startDate: Yup.date().min(new Date(), "Date must be after today."),
  endDate: Yup.date().min(new Date(), "Date must be after today."),
});

module.exports = { LeagueSchema };
