// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// 🔹 Thunk to fetch authentication status
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async () => {
    console.log('7777777777777777777777')
    const response = await api.get("/api/authenticate");
    console.log('api response.data :- ', response.data);
    return response.data;
});

const authSlice = createSlice({
    name: "auth",
    initialState: { isAuthenticated: false, loading: true },
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.loading = false;
        },
        login : (state) => {
            state.isAuthenticated = true;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                if (action.payload.status)
                    state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;
