const picksFilters = {
  game: true,
  player: true,
  all: true,
};

const isValidFilter = (filter) => {
  return picksFilters[filter];
};

module.exports = {
  isValidFilter,
};
