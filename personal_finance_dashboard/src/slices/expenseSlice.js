import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";
import { checkLoginStatus } from "./authSlice";

const initialState = {
    expenses: [],
    isLoading: false,
    hasError: false
}

export const loadExpenses = createAsyncThunk(
    'expenses/loadExpenses',
    async ({userId}) => {
        try {
            const response = await api.get(`/expenses?userId=${userId}`, {
                withCredentials: true
            });
            // console.log('Expenses data: ', response.data)
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const loadExpense = createAsyncThunk(
    'expenses/loadExpense',
    async ({expenseId, userId}) => {
        try {
            const response = await api.get('/expenses/' + expenseId + '?userId=' + userId, {
                withCredentials: true
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async ({userId, description, amount, category}, {dispatch}) => {
        try {
            const response = await api.post('/expenses/?userId=' + userId, {
                category,
                amount,
                description
            });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/updateExpense',
    async ({expenseId, description, amount, category}, {dispatch}) => {
        try {
            const response = await api.put(`/expenses/${expenseId}`, {
                category,
                amount,
                description
            });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch(err) {
            throw err.response.data;
        }  
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async ({expenseId}, {dispatch}) => {
        try {
            const response = await api.delete(`/expenses/${expenseId}`, {
                withCredentials: true,
            });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadExpenses.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadExpenses.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                // console.log('Current expenses are ', state.expenses)
                state.expenses = action.payload;
            })
            .addCase(loadExpense.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadExpense.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.expenses = state.expenses.find(item => item.id === action.payload.expenseId);
            })
            .addCase(addExpense.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addExpense.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.expenses.push(action.payload);
            })
            .addCase(updateExpense.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateExpense.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                const updatedExpenses = action.payload;
                state.expenses = state.expenses.map((expense) =>
                    expense.id === updatedExpenses.id ? updatedExpenses : expense
                );
            })
            .addCase(deleteExpense.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(deleteExpense.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.expenses = state.expenses.filter((item) => item.id !== action.payload.expenseId);
            })
    }
});

export default expenseSlice.reducer;