// import type { JSX } from "react";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import { RootState } from "./store";

type Props = { children: React.ReactElement };

const ProtectedRoute = ({ children }: Props) => {
    const navigate = useNavigate()
    // const { accessToken } = useAuth();

    // useEffect(() => {
    //     if (!accessToken) {
    //         navigate('/signin')
    //     }
    // });

    // // Don't render children if no access token
    // if (!accessToken) {
    //     return null; // or a loading spinner
    // }

    const accessToken = useSelector((state: RootState) => state.accessToken.value);
    const isAuthorised = useSelector((state: RootState) => state.accessToken.isAuthenticated);

    useEffect(()=> {
        if(!accessToken && !isAuthorised){
            navigate('/signin');
        }
    });

    if(!accessToken){
        return null;
    }

    return children;
};

export default ProtectedRoute;