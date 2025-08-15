import React, { createContext, type ReactNode, useContext, useState } from "react"
import { useDispatch } from "react-redux";
import { clearAccessToken, setAccessToken } from "../features/accessToken/accessTokenSlice";

type AuthContextType = {
    accessTokenLocal: string | null;
    refreshTokenLocal: string | null;
    login: (access: string, refresh: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [accessTokenLocal, setAccessTokenLocal] = useState<string | null>(null);
    const [refreshTokenLocal, setRefreshTokenLocal] = useState<string | null>(null);

    const dispatch = useDispatch()

    const login = (access: string, refresh: string) => {
        setAccessTokenLocal(access);
        setRefreshTokenLocal(refresh);

        dispatch(setAccessToken(access)); //redux
        localStorage.setItem("refreshToken", refresh);
    }

    const logout = () => {
        setAccessTokenLocal(null);
        setRefreshTokenLocal(null);

        dispatch(clearAccessToken()); //redux
        localStorage.removeItem("refreshToken");
    }

    return (
        <AuthContext.Provider value={{accessTokenLocal, refreshTokenLocal, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used inside AuthProvider");
    return context
}