const ROUTES = {
    HOME: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    USER: (userId) =>  `/${userId}`,
    EXPENSES: '/expenses',
    EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    INCOMES: '/income',
    INCOME: (incomeId) => `/income/${incomeId}`,
    INVESTMENTS: '/investments'
};

export default ROUTES;