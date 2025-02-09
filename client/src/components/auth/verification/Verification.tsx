import React, { useEffect, useState } from "react";
import "./Verification.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Verification(){
    const [email, setEmail]=useState("")
    const [otp, setOtp]=useState("");
    
    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL
    const navigate=useNavigate();

    useEffect(()=>{
        async function fetchEmail(){
            try{
                const response=await fetch(`${apiUrl}/fetchUser`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setEmail(result.user?.email);
                }
                console.log(result.message);
            }
            catch(error){
                if(error instanceof Error){
                    console.log("Error while fetching data: ", error.message);
                }
                else{
                    console.log("An unknown error occurred");
                }
            }
        };

        fetchEmail();
    }, [apiUrl]);

    async function verifyOTP(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/verifyOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/dashboard");
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                toast.error("Error while verification: "+ error.message);
            }
            else{
                toast.error("An unknown error occurred");
            }
        }
    }

    return(
        <div className="verification">
            <img src="/gifts.jpg" alt="img" className="verification-image"/>
            <img src="/cake.png" alt="img" className="verification-logo"/>
            <div className="verification-contents">
                <h1>Enter OTP</h1>
                <form onSubmit={verifyOTP}>
                    <div className="input-container">
                        <input type="email" name="email" value={email} required onChange={(e)=>setEmail(e.target.value)} placeholder=" "/>
                        <label>Email</label>
                    </div>
                    <div className="input-container">
                        <input type="text" name="otp" value={otp} required onChange={(e)=>setOtp(e.target.value)} placeholder=" "/>
                        <label>OTP</label>
                    </div>
                    <button className="verification-button" type="submit">
                        <span className="verification-icon-wrapper">
                            <img src="arrow.png" alt="img" className="verification-icon"/>
                        </span>
                        Verify
                    </button>
                </form>
            </div>
        </div>
    )
}