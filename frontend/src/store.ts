import { configureStore } from "@reduxjs/toolkit";
import accessTokenReducer from "./features/accessToken/accessTokenSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig ={
    key: "accessToken",
    storage
}

const persistedReducer = persistReducer(persistConfig, accessTokenReducer)

export const store = configureStore({
    reducer: {
        accessToken: persistedReducer
    }
});

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;