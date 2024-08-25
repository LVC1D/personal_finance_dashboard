import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";
import { checkLoginStatus } from "./authSlice";

const initialState = {
    users: [],
    userBalances: [],
    isLoading: false,
    hasError: false,
    isSuccess: false
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

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async({userId, email, name, password}, {dispatch}) => {
        try {
            const response = await api.put(`/users/${userId}`, { email, name, password });
            await dispatch(checkLoginStatus());
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
)

const incomeSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadBalances.pending, state => {
                state.isLoading = true;
                state.hasError = false;
                state.isSuccess = false;
            })
            .addCase(loadBalances.rejected, state => {
                state.isLoading = false;
                state.hasError = true;
                state.isSuccess = false;
            })
            .addCase(loadBalances.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                // console.log('Current balance payload: ', action.payload)
                state.userBalances = action.payload;
                state.isSuccess = true;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.isSuccess = false;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(updateUser.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
                state.isSuccess = false;
            });
    }
});

export default incomeSlice.reducer;