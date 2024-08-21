import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import incomeSlice from './slices/incomeSlice';
import expenseSlice from './slices/expenseSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        incomes: incomeSlice,
        expenses: expenseSlice,
        users: userSlice,
    }
})