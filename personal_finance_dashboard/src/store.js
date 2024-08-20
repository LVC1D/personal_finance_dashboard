import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import incomeSlice from './slices/incomeSlice';
import expenseSlice from './slices/expenseSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        incomes: incomeSlice,
        expenses: expenseSlice,
    }
})