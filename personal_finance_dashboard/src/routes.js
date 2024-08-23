const ROUTES = {
    HOME: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    USER: (userId) =>  `/${userId}`,
    EXPENSES: (userId) => `/${userId}/expenses`,
    EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    INCOMES: (userId) => `/${userId}/income`,
    INCOME: (incomeId) => `/income/${incomeId}`,
    INVESTMENTS: '/investments'
};

export default ROUTES;