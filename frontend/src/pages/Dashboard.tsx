import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { Profile } from "../components/Profile";



export const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function logoutFunction() {
        setIsLoggingOut(true);
        logout();
        navigate("/signin");
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl mb-8">
                WELCOME
            </h1>
            <div>
                <button
                    onClick={logoutFunction}
                    disabled={isLoggingOut}
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded">
                    {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
                </button>
            </div>
            <div>
                <Profile />
            </div>
        </div>
    )
}