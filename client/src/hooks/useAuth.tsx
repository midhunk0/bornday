import { useEffect, useState } from "react";
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

interface UserData{
    _id: string;
    username: string;
    email: string;
}

interface UpdateUserProps{
    username: string;
    email: string;
}

export function useAuth(){
    const navigate=useNavigate();
    const [verified, setVerified]=useState(true);
    const [userData, setUserData]=useState<UserData>({
        _id: "",
        username: "",
        email: ""
    })

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    async function register(registerData: RegisterProps){
        try{
            const response=await fetch(`${apiUrl}/auth/registerUser`, {
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
            const response=await fetch(`${apiUrl}/auth/loginUser`, {
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
            const response=await fetch(`${apiUrl}/auth/sendOTP`, {
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
            const response=await fetch(`${apiUrl}/auth/verifyOTP`, {
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
            const response=await fetch(`${apiUrl}/auth/logoutUser`, {
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

    useEffect(()=>{
        async function fetchUser(){
            try{
                const response=await fetch(`${apiUrl}/auth/fetchUser`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setUserData(result.user);
                }
                else{
                    toast.error(result.message);
                }
            }
            catch(error: unknown){
                if(error instanceof Error){
                    console.log("Error while fetching data: ", error.message);
                }
                else{
                    console.log("An unknown error occurred");
                }
            }
        }

        fetchUser();
    }, [apiUrl]);

    async function updateUser(updateUserData: UpdateUserProps){
        try{
            const response=await fetch(`${apiUrl}/auth/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateUserData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                if(!result.verified){
                    navigate("/verify");
                }
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
            return response;
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.log("Error while updating: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    async function deleteAccount(){
        try{
            const response=await fetch(`${apiUrl}/auth/deleteUser`, { 
                method: "delete",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/register");
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while deleting user: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    };
    
    return{
        register,
        login,
        verified,
        sendOTP,
        verifyOTP,
        logout,
        userData, 
        updateUser, 
        deleteAccount
    }
}