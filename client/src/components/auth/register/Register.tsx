import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

interface RegisterData{
    username: string,
    email: string,
    password: string
};

export function Register(){
    const [registerData, setRegisterData]=useState<RegisterData>({
        username: "",
        email: "",
        password: ""
    });
    const [visible, setVisible]=useState<boolean>(false);

    const environment=import.meta.env.MODE;
    const apiUrl=environment==='development'
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;
    const navigate=useNavigate();

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setRegisterData(prevState=>({
            ...prevState,
            [name]: value
        }));
    };

    function toggleVisibility(){
        setVisible(!visible);
    }

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
                navigate("/verify");
            }
            console.log(result.message);
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.error("Error during registration: ", error.message);
            }
            else{
                console.error("An unknown error occurred");
            }
        }
    };

    return(
        <div className="register">
            <div className="register-image">
                <img src="/gifts.jpg" alt="img"/>
            </div>
            <div className="register-contents">
                <div className="register-logo">
                    <img src="/cake.png" alt="img"/>
                </div>
                <div className="register-form">
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
                        <div className="password-container">
                            <div className="input-container">
                                <input type={visible ? "text" : "password"} name="password" value={registerData.password} required onChange={handleInputChange} placeholder=" "/>
                                <label>Password</label>
                            </div>
                            <div className={`image-container ${visible ? "visible" : ""}`} onClick={toggleVisibility}>
                                <img src={visible ? "visible.png" : "visible_off.png"} alt="img"/>
                            </div>
                        </div>
                        <button className="register-button" type="submit">
                            <div className="register-button-icon-wrapper">
                                <img src="arrow.png" alt="icon" className="register-button-icon" />
                            </div>
                            Register
                        </button>
                    </form>
                    <p className="register-footer">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};