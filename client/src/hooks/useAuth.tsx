import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface RegisterProps{
    username: string;
    email: string;
    password: string;
}

interface LoginProps{
    credential: string;
    password: string;
}

interface VerifyProps{
    email: string;
    otp: string;
}

export function useAuth(){
    const navigate=useNavigate();
    const [verified, setVerified]=useState(true);

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    async function register(registerData: RegisterProps){
        try{
            const response=await fetch(`${apiUrl}/registerUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/verify");
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while registration: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    async function login(loginData: LoginProps){
        try{
            const response=await fetch(`${apiUrl}/loginUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/dashboard");
            }
            else{
                if(result.verified===false){
                    setVerified(false);
                }
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while login: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    async function sendOTP(email: string){
        try{
            const response=await fetch(`${apiUrl}/sendOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/verify");
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while sending OTP", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    async function verifyOTP(verifyData: VerifyProps){
        try{
            const response=await fetch(`${apiUrl}/verifyOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verifyData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                setVerified(result.verified);
                navigate("/dashboard");
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while verification: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    async function logout(){
        try{
            const response=await fetch(`${apiUrl}/logoutUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/")
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while logout: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    return{
        register,
        login,
        verified,
        sendOTP,
        verifyOTP,
        logout
    }
}