import React, { useState } from "react";
import "./Register.css";
import { AuthButton } from "../../../components/buttons/authButton/AuthButton";
import { Input } from "../../../components/input/Input";
import { Password } from "../../../components/password/Password";
import { useAuth } from "../../../hooks/useAuth";

interface RegisterData{
    username: string,
    email: string,
    password: string
};

export function Register(){
    const {register}=useAuth();
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

    function handleRegister(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        register(registerData);
    };

    return(
        <div className="register">
            <img src="/gifts.jpg" alt="img" className="register-image"/>
            <img src="/cake.png" alt="img" className="register-logo"/>
            <div className="register-contents">
                <h1>Welcome To Bornday.</h1>
                <form onSubmit={handleRegister}>
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