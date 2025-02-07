import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps{
    children: ReactNode
};

const ProtectedRoute: React.FC<ProtectedRouteProps>=({ children })=>{
    const isAuth=document.cookie.includes("jwt");
    return isAuth ? children : <Navigate to="/"/>
}

export default ProtectedRoute;