import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

const initialState = {
    users: [],
    userBalances: [],
    isLoading: false,
    hasError: false
}

export const loadBalances = createAsyncThunk(
    'users/loadBalances',
    async ({userId}) => {
        console.log('In loadBalances thunk, received userId:', userId);
        try {
            const url = `/users/${userId}/balances`;
            const response = await api.get(url, {
                withCredentials: true,
            });
            console.log('Balance data: ', response.data)
            return response.data;
        } catch(err) {
            throw err.response.data;
        }
    }
);

const incomeSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadBalances.pending, state => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadBalances.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(loadBalances.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                // console.log('Current balance payload: ', action.payload)
                state.userBalances = action.payload;
            });
    }
});

export default incomeSlice.reducer;