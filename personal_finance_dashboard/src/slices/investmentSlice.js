import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";
import { checkLoginStatus } from "./authSlice";

const initialState = {
    investments: [],
    isLoading: false,
    hasError: false
}

export const loadInvestments = createAsyncThunk(
    'investments/loadInvestments',
    async ({userId}) => {
        // console.log('In loadIncomes thunk, received userId:', userId);
        try {
            const url = `/investments?userId=${userId}`;
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

export const loadInvestment = createAsyncThunk(
    'investments/loadInvestment',
    async ({investmentId, userId}) => {
        try {
            const response = await api.get('/investments/' + investmentId + '?userId=' + userId, {
                withCredentials: true,
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

export const addInvestment = createAsyncThunk(
    'investments/addInvestment',
    async ({userId, assetName, amount, openPrice}, {dispatch}) => {
        try {
            const response = await api.post('/investments/?userId=' + userId, {
                assetName,
                amount,
                openPrice
            });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

export const updateInvestment = createAsyncThunk(
    'investments/updateInvestment',
    async ({investmentId, assetName, amount, openPrice}) => {
        try {
            const response = await api.put('/investments/' + investmentId, {
                assetName,
                amount,
                openPrice
            });
            return response.data;
        } catch(err) {
            throw err.response.data;
        }  
    }
);

export const deleteInvestment = createAsyncThunk(
    'investments/deleteInvestment',
    async ({investmentId}, {dispatch}) => {
        try {
            const response = await api.delete(`/investments/${investmentId}`, {
                withCredentials: true,
            });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch(err) {
            throw err.response.data;
        } 
    }
);

const investmentSlice = createSlice({
    name: 'investments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadInvestments.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadInvestments.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadInvestments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                // console.log('Current state income is ', state.incomes)
                state.investments = action.payload;
            })
            .addCase(loadInvestment.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadInvestment.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadInvestment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                // console.log('Action payload: ', action.payload);
                state.investments = state.investments.find(item => item.id === action.payload.investmentId);
            })
            .addCase(addInvestment.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addInvestment.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(addInvestment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.investments.push(action.payload);
            })
            .addCase(updateInvestment.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateInvestment.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(updateInvestment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.investments = action.payload;
            })
            .addCase(deleteInvestment.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(deleteInvestment.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(deleteInvestment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                console.log('Post-deletion action payload: ', action.payload)
                state.investments = state.investments.filter((item) => item.id !== action.payload.investmentId);
                
            });
    }
});

export default investmentSlice.reducer;
