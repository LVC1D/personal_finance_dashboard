const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};

async function totalIncome(userId, pool) {
    let currentSubTotal = 0;
    let totalIncomeResult = await pool.query('SELECT * FROM income WHERE user_id = $1', [userId]);
  
    for (const item of totalIncomeResult.rows) {
      currentSubTotal += parseFloat(item.amount);
      // console.log(item);
    }
  
    return currentSubTotal;
};

async function totalExpenses(userId, pool) {
    let currentSubTotal = 0;
    let totalExpensesResult = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
  
    for (const item of totalExpensesResult.rows) {
        currentSubTotal += parseFloat(item.amount);
      // console.log(item);
    }
  
    return currentSubTotal;
};

async function totalInvestments(userId, pool) {
    let currentSubTotal = 0;
    let totalInvestmentResult = await pool.query('SELECT * FROM investments WHERE user_id = $1', [userId]);
  
    for (const item of totalInvestmentResult.rows) {
      currentSubTotal += parseFloat(item.amount);
      // console.log(item);
    }
  
    return currentSubTotal;
};

module.exports = {
    ensureAuthenticated,
    totalIncome,
    totalExpenses,
    totalInvestments
}