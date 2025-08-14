// import type { JSX } from "react";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom"

type Props = { children: React.ReactElement };

const ProtectedRoute = ({ children }: Props) => {
    const navigate = useNavigate()
    const { accessToken } = useAuth();

    useEffect(() => {
        if (!accessToken) {
            navigate('/signin')
        }
    });

    // Don't render children if no access token
    if (!accessToken) {
        return null; // or a loading spinner
    }

    return children;
};

export default ProtectedRoute;