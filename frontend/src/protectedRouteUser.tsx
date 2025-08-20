import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



type Props = { children: React.ReactElement };

type TokenPayload = {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
};

const ProtectedRouteUser = ( {children} : Props) => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const decoded = accessToken ? jwtDecode<TokenPayload>(accessToken) : null;

    function presentPage(){
        navigate(-1)
    }

    useEffect(() => {
        if(accessToken && decoded?.role !== "user"){
            presentPage()
        }
    }, [accessToken && decoded?.role !=="user"]);

        // Don't render children if no access token
    if (!accessToken) {
        return null; // or a loading spinner
    }

    return children;
}

export default ProtectedRouteUser