import React, { useState } from "react";
import "./Login.css";
import { AuthButton } from "../../../components/buttons/authButton/AuthButton";
import { Input } from "../../../components/input/Input";
import { Password } from "../../../components/password/Password";
import { useAuth } from "../../../hooks/useAuth";

interface LoginData{
    credential: string,
    password: string
};

export function Login(){
    const { login, verified, sendOTP }=useAuth();
    
    const [loginData, setLoginData]=useState<LoginData>({
        credential: "",
        password: ""
    });

    const [email, setEmail]=useState<string>("");
    const [forgotPassword, setForgotPassword]=useState<boolean>(false);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setLoginData(prev=>({
            ...prev,
            [name]: value
        }));
    };

    function handleLogin(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        login(loginData);
    };

    function handleSendOTP(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        sendOTP(email)
    }

    return(
        <div className="login">
            <img src="/gifts.jpg" alt="img" className="login-image"/>
            <img src="cake.png" alt="img" className="login-logo"/>
            <div className="login-contents">
                <h1>Welcome Back.</h1>
                {(!verified || forgotPassword) ? (
                    <form onSubmit={handleSendOTP}>
                        <Input type="email" name="email" value={email} inputFunction={(e)=>setEmail(e.target.value)} text="Email"/>
                        <AuthButton text="Send OTP"/>
                    </form>
                ):(
                    <form onSubmit={handleLogin}>
                        <Input type="text" name="credential" value={loginData.credential} inputFunction={handleInputChange}text="Username/Email"/>
                        <Password name="password" value={loginData.password} inputFunction={handleInputChange}/>
                        <a onClick={()=>setForgotPassword(true)} className="login-forgot-password">Forgot password.</a>
                        <AuthButton text="Login"/>
                    </form>
                )}
                <p className="login-footer">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};