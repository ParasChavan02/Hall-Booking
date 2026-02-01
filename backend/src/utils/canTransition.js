const bookingTransitions = require("./bookingTransitions");

const canTransition = (currentStatus, role, nextStatus) => {
  return (
    bookingTransitions[currentStatus] &&
    bookingTransitions[currentStatus][role] &&
    bookingTransitions[currentStatus][role].includes(nextStatus)
  );
};

module.exports = canTransition;
