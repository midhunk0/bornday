// src/components/PrivateRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps{
    children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps>=({ children })=>{
    const [isAuthenticated, setIsAuthenticated]=useState<boolean | null>(null);

    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL

    const location=useLocation();

    useEffect(()=>{
        const verifyUser=async()=>{
            try{
                const response=await fetch(`${apiUrl}/fetchUser`, {
                    method: "GET",
                    credentials: "include"
                });
                if(response.ok){
                    setIsAuthenticated(true);
                }
                else{
                    setIsAuthenticated(false);
                }
            } 
            catch(error){
                setIsAuthenticated(false);
                console.log("Error while veriying user: ", error);
            }
        };

        verifyUser();
    }, [location.pathname, apiUrl]);

    if(isAuthenticated===null){
        return null;
    }

    return isAuthenticated ? children : <Navigate to="/login"/>;
};
