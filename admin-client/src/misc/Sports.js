export const sports = {
  BLITZBALL: "blitzball",
  SOCCER: "soccer",
};

export const getListOfSports = () =>
  Object.keys(sports).map((key) => sports[key]);
