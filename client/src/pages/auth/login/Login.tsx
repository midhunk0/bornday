import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthButton } from "../../../components/buttons/authButton/AuthButton";

interface LoginData{
    credential: string,
    password: string
};

export function Login(){
    const navigate=useNavigate();
    
    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    const  [loginData, setLoginData]=useState<LoginData>({
        credential: "",
        password: ""
    });
    const [visible, setVisible]=useState<boolean>(false);
    const [verified, setVerified]=useState<boolean>(true);
    const [email, setEmail]=useState("");
    const [forgotPassword, setForgotPassword]=useState<boolean>(false);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setLoginData(prev=>({
            ...prev,
            [name]: value
        }));
    };

    async function loginUser(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
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
                if(!result.verified){
                    setVerified(false);
                }
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error: unknown){
            if(error instanceof Error){
                toast.error("Error during login: "+ error.message);
            }
            else{
                toast.error("An unknown error occurred");
            }
        }
    };

    async function verifyOTP(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
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
        catch(error: unknown){
            if(error instanceof Error){
                toast.error("Error during sending OTP: "+ error.message);
            }
            else{
                toast.error("An unknown error occurred");
            }
        }
    }

    return(
        <div className="login">
            <img src="/gifts.jpg" alt="img" className="login-image"/>
            <img src="cake.png" alt="img" className="login-logo"/>
            <div className="login-contents">
                <h1>Welcome Back.</h1>
                {verified && !forgotPassword ? (
                    <form onSubmit={loginUser}>
                        <div className="input-container">
                            <input type="text" name="credential" value={loginData.credential} required onChange={handleInputChange} placeholder=" "/>
                            <label>Username/Email</label>
                        </div>
                        <div className="login-password-container">
                            <div className="input-container">
                                <input type={visible ? "text" : "password"} name="password" value={loginData.password} required onChange={handleInputChange} placeholder=" "/>
                                <label>Password</label>
                            </div>
                            <div className={`login-image-container ${visible ? "visible" : ""}`} onClick={()=>setVisible(!visible)}>
                                <img src={visible ? "visible.png" : "visible_off.png"} alt="img"/>
                            </div>
                        </div>
                        <a onClick={()=>setForgotPassword(true)} className="login-forgot-password">Forgot password.</a>
                        <AuthButton text="Login"/>
                    </form>
                ):(
                    <form onSubmit={verifyOTP}>
                        <div className="input-container">
                            <input type="email" name="email" value={email} required onChange={(e)=>setEmail(e.target.value)} placeholder=" "/>
                            <label>Email</label>
                        </div>
                        <button className="login-button" type="submit">
                            <span className="login-icon-wrapper">
                                <img src="arrow.png" alt="img" className="login-icon"/>
                            </span>
                            Send OTP
                        </button>
                    </form>
                )}
                <p className="login-footer">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};