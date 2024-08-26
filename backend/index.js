const express = require('express');
const app = express();
const port = process.env.PORT || 10000;
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const {pool} = require('./model/database');
const morgan = require('morgan');
const cors = require('cors');
const partials = require('express-partials');
const flash = require('connect-flash');
require('dotenv').config();
const {
    ensureAuthenticated,
    totalIncome,
    totalExpenses,
    totalInvestments
} = require('./helpers');
const {authRouter, initAuth} = require('./apiRoutes/authApi');
const userRouter = require('./apiRoutes/userApi')(pool, ensureAuthenticated);
const incomeRouter = require('./apiRoutes/incomeApi')(pool, ensureAuthenticated, totalIncome);
const expenseRouter = require('./apiRoutes/expenseApi')(pool, ensureAuthenticated, totalExpenses);
const investmentRouter = require('./apiRoutes/investmentApi')(pool, ensureAuthenticated, totalInvestments);
const csrfProtection = require('./csrfConfig');

// set up and initialzie the server

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://js.stripe.com"],
            imgSrc: ["'self'", "data:", "https://static-assets.codecademy.com"],
            connectSrc: ["'self'", "https://personal-finance-dashboard.onrender.com/"],
        },
    },
}));

app.use(cors({
    origin: 'https://personal-finance-front.onrender.com',
    credentials: true,
}));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'personal_finance_dashboard', 'dist')));
app.use(partials());

app.use(flash());

initAuth(app);

app.use(csrfProtection);

app.use((req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, {
        secure: process.env.NODE_ENV === 'production', //true
        httpOnly: false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' //'none'
    });
    res.locals.csrfToken = csrfToken;
    console.log('CSRF token:', csrfToken);
    next();
});

// apply the API routes
app.use('/api/auth', authRouter);
app.use('/users', userRouter);
app.use('/incomes', incomeRouter);
app.use('/expenses', expenseRouter);
app.use('/investments', investmentRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'personal_finance_dashboard', 'dist', 'index.html'));
});



app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})