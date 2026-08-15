const validTransitions = {
  open: ["assigned"],
  assigned: ["in_progress"],
  in_progress: ["resolved"],
  resolved: ["closed"],
  closed: [],
};

const isValidTransition = (currentStatus, newStatus) => {
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

module.exports = {
  isValidTransition,
};