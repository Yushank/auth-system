import { createSlice } from "@reduxjs/toolkit";



const accessTokenSlice = createSlice({
    name: "accessToken",
    initialState: {
        value: null,
        isAuthenticated: false
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.value = action.payload
            state.isAuthenticated = true
        },
        clearAccessToken: (state) => {
            state.value = null
            state.isAuthenticated = false
        }
    }
});

export const {setAccessToken, clearAccessToken} = accessTokenSlice.actions
export default accessTokenSlice.reducer