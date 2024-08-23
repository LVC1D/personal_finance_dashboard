import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";
import { checkLoginStatus } from "./authSlice";

const initialState = {
    incomes: [],
    isLoading: false,
    hasError: false
}

export const loadIncomes = createAsyncThunk(
    'incomes/loadIncomes',
    async ({userId}) => {
        // console.log('In loadIncomes thunk, received userId:', userId);
        try {
            const url = `/incomes?userId=${userId}`;
            const response = await api.get(url, {
                withCredentials: true,
            });
            // console.log('Incomes data: ', response.data)
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const loadIncome = createAsyncThunk(
    'incomes/loadIncome',
    async ({incomeId, userId}) => {
        try {
            const response = await api.get('/incomes/' + incomeId + '?userId=' + userId, {
                withCredentials: true,
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const addIncome = createAsyncThunk(
    'incomes/addIncome',
    async ({userId, description, amount, category}, {dispatch}) => {
        try {
            const response = await api.post('/incomes/?userId=' + userId, {
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

export const updateIncome = createAsyncThunk(
    'incomes/updateIncome',
    async ({incomeId, description, amount, category}) => {
        try {
            const response = await api.put('/incomes/' + incomeId, {
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
    'incomes/deleteIncome',
    async ({incomeId}, {dispatch}) => {
        try {
            const response = await api.delete(`/incomes/${incomeId}`, {
                withCredentials: true,
            });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

const incomeSlice = createSlice({
    name: 'incomes',
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
                // console.log('Current state income is ', state.incomes)
                state.incomes = action.payload;
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
                // console.log('Action payload: ', action.payload);
                state.incomes = state.incomes.find(item => item.id === action.payload.incomeId);
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
                state.incomes.push(action.payload);
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
                state.incomes = action.payload;
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
                console.log('Post-deletion action payload: ', action.payload)
                state.incomes = state.incomes.filter((item) => item.id !== action.payload.incomeId);
                
            });
    }
});

export default incomeSlice.reducer;