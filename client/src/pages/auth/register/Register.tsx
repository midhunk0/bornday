import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    const [visible, setVisible]=useState<boolean>(false);

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
                    <div className="input-container">
                        <input type="text" name="username" value={registerData.username} required onChange={handleInputChange} placeholder=" "/>
                        <label>Username</label>
                    </div>
                    <div className="input-container">
                        <input type="email" name="email" value={registerData.email} required onChange={handleInputChange} placeholder=" "/>
                        <label>Email</label>
                    </div>
                    <div className="register-password-container">
                        <div className="input-container">
                            <input type={visible ? "text" : "password"} name="password" value={registerData.password} required onChange={handleInputChange} placeholder=" "/>
                            <label>Password</label>
                        </div>
                        <div className={`register-image-container ${visible ? "visible" : ""}`} onClick={()=>setVisible(!visible)}>
                            <img src={visible ? "visible.png" : "visible_off.png"} alt="img"/>
                        </div>
                    </div>
                    <button className="register-button" type="submit">
                        <div className="register-icon-wrapper">
                            <img src="/arrow.png" alt="icon" className="register-icon" />
                        </div>
                        Register
                    </button>
                </form>
                <p className="register-footer">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};