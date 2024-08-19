import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../axios';

const initialState = {
    user: null,
    isAuth: false,
    isLoading: false,
    hasError: false,
    error: null
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({email, name, password}) => {
        try {
            const response = await api.post('/api/auth/register', {
                email,
                name,
                password
            });
            return response.data;
        } catch(err) {
            throw err.response.data
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({email, password}) => {
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password
            });
            console.log('Login response data: ', response.data);
            return response.data;
        } catch(err) {
            throw err.response.data
        } 
    }
);

export const checkLoginStatus = createAsyncThunk(
    'auth/checkStatus',
    async () => {
        try {
            const { data } = await api.get('/api/auth/is_logged_in', {
                withCredentials: true
            });
            return data;
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            return {
                user: null,
                isAuth: false,
            };
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state) => {
            state.isAuth = true;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuth = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.hasError = null;
                state.isAuth = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.error = action.error.message;
                state.isAuth = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.hasError = null;
                state.isAuth = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuth = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.error = action.error.message;
                state.user = null;
                state.isAuth = false;
            })
            .addCase(checkLoginStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkLoginStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuth = state.isAuth === true || state.isAuth === false;
                state.user = action.payload.user;
                console.log('Current isAuth payload: ', state.isAuth)
            })
            .addCase(checkLoginStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.error = action.error.message;
                state.isAuth = false;
            });
    }
});
export const {setUser, logoutUser} = authSlice.actions;
export default authSlice.reducer;