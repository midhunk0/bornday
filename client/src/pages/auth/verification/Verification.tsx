import React, { useEffect, useState } from "react";
import "./Verification.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthButton } from "../../../components/buttons/authButton/AuthButton";
import { Input } from "../../../components/input/Input";

export function Verification(){
    const navigate=useNavigate();

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    const [email, setEmail]=useState("");
    const [otp, setOtp]=useState("");;
    
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
    }, [apiUrl, email]);

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
                    <Input type="email" name="email" value={email} inputFunction={(e)=>setEmail(e.target.value)} text="Email"/>
                    <Input type="text" name="otp" value={otp} inputFunction={(e)=>setOtp(e.target.value)} text="OTP"/>
                    <AuthButton text="Verify"/>
                </form>
            </div>
        </div>
    )
}