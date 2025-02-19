import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthButton } from "../../../components/buttons/authButton/AuthButton";
import { Input } from "../../../components/input/Input";
import { Password } from "../../../components/password/Password";

interface RegisterData{
    username: string,
    email: string,
    password: string
};

export function Register(){
    const navigate=useNavigate();

    const apiUrl=import.meta.env.MODE==='development'
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    const [registerData, setRegisterData]=useState<RegisterData>({
        username: "",
        email: "",
        password: ""
    });

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setRegisterData(prev=>({
            ...prev,
            [name]: value
        }));
    };

    async function registerUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/registerUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message)
                navigate("/verify");
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error: unknown){
            if(error instanceof Error){
                toast.error("Error during registration: "+ error.message);
            }
            else{
                toast.error("An unknown error occurred");
            }
        }
    };

    return(
        <div className="register">
            <img src="/gifts.jpg" alt="img" className="register-image"/>
            <img src="/cake.png" alt="img" className="register-logo"/>
            <div className="register-contents">
                <h1>Welcome To Bornday.</h1>
                <form onSubmit={registerUser}>
                    <Input type="text" name="username" value={registerData.username} inputFunction={handleInputChange}text="Username"/>
                    <Input type="email" name="email" value={registerData.email} inputFunction={handleInputChange}text="Email"/>
                    <Password name="password"    value={registerData.password} inputFunction={handleInputChange}/>
                    <AuthButton text="Register"/>
                </form>
                <p className="register-footer">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};