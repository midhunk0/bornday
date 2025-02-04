import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

interface LoginData{
    credential: string,
    password: string
};

export function Login(){
    const  [loginData, setLoginData]=useState<LoginData>({
        credential: "",
        password: ""
    });
    const [visible, setVisible]=useState<boolean>(false);
    
    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL
    const navigate=useNavigate();

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setLoginData(prevState=>({
            ...prevState,
            [name]: value
        }));
    };

    function toggleVisibility(){
        setVisible(!visible);
    }

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
                navigate("/dashboard");
            }
            console.log(result.message);
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.error("Error during login: ", error.message);
            }
            else{
                console.error("An unknown error occurred");
            }
        }
    }

    return(
        <div className="login">
            <div className="login-image">
                <img src="/gifts.jpg" alt="img"/>
            </div>
            <div className="login-contents">
                <div className="login-logo">
                    <img src="cake.png" alt="img"/>
                </div>
                <div className="login-form">
                    <h1>Welcome Back.</h1>
                    <form onSubmit={loginUser}>
                        <div className="input-container">
                            <input type="text" name="credential" value={loginData.credential} required onChange={handleInputChange} placeholder=" "/>
                            <label>Username/Email</label>
                        </div>
                        <div className="password-container">
                            <div className="input-container">
                                <input type={visible ? "text" : "password"} name="password" value={loginData.password} required onChange={handleInputChange} placeholder=" "/>
                                <label>Password</label>
                            </div>
                            <div className={`image-container ${visible ? "visible" : ""}`} onClick={toggleVisibility}>
                                <img src={visible ? "visible.png" : "visible_off.png"} alt="img"/>
                            </div>
                        </div>
                        <button type="submit" className="login-button">
                            <span className="login-button-icon-wrapper">
                                <img src="arrow.png" alt="icon" className="login-button-icon"/>
                            </span>
                            Login
                        </button>
                    </form>
                    <p className="login-footer">
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
};