import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import incomeSlice from './slices/incomeSlice';
import expenseSlice from './slices/expenseSlice';
import investmentSlice from './slices/investmentSlice';
import userSlice from './slices/userSlice';
import tooltipSlice from './slices/tooltipSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        incomes: incomeSlice,
        expenses: expenseSlice,
        users: userSlice,
        investments: investmentSlice,
        tooltip: tooltipSlice,
    }
})