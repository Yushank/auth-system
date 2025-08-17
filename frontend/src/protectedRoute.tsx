import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

type Props = { children: React.ReactElement };

const ProtectedRoute = ({ children }: Props) => {
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('accessToken');

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