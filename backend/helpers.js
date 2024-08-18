const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};

async function calculateSubtotal(pool) {
  let currentSubTotal = 0;

  return currentSubTotal;
};

module.exports = {
    ensureAuthenticated,
    calculateSubtotal
}