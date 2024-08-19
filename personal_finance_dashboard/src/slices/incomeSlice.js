import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

const initialState = {
    income: [],
    isLoading: false,
    hasError: false
}

export const loadIncomes = createAsyncThunk(
    'income/loadIncomes',
    async ({userId}) => {
        try {
            const response = await api.get(`/income?userId=${userId}`, {
                withCredentials: true
            });
            console.log('Incomes data: ', response.data)
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const loadIncome = createAsyncThunk(
    'income/loadIncome',
    async ({incomeId, userId}) => {
        try {
            const response = await api.get('/income/' + incomeId + '?userId=' + userId, {
                withCredentials: true
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const addIncome = createAsyncThunk(
    'income/addIncome',
    async ({userId, description, amount, category}) => {
        try {
            const response = await api.post('/income/?userId=' + userId, {
                category,
                amount,
                description
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

export const updateIncome = createAsyncThunk(
    'income/updateIncome',
    async ({incomeId, description, amount, category}) => {
        try {
            const response = await api.put('/income/' + incomeId, {
                category,
                amount,
                description
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        }  
    }
);

export const deleteIncome = createAsyncThunk(
    'income/deleteIncome',
    async (incomeId) => {
        try {
            const response = await api.delete('/income/' + incomeId, {
                withCredentials: true
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadIncomes.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadIncomes.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadIncomes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                console.log('Current state income is ', state.income)
                state.income = action.payload;
            })
            .addCase(loadIncome.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadIncome.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadIncome.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.income = action.payload;
            })
            .addCase(addIncome.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addIncome.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(addIncome.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.income = action.payload;
            })
            .addCase(updateIncome.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateIncome.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(updateIncome.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.income = action.payload;
            })
            .addCase(deleteIncome.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(deleteIncome.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(deleteIncome.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.income = state.income.filter(item => item.id !== action.payload.incomeId);
            })
    }
});

export default incomeSlice.reducer;