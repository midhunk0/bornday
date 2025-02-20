import React, { useState } from "react";
import "./Verification.css";
import { AuthButton } from "../../../components/buttons/authButton/AuthButton";
import { Input } from "../../../components/input/Input";
import { useAuth } from "../../../hooks/useAuth";

interface VerifyData{
    email: "",
    otp: ""
};

export function Verification(){
    
    const {verifyOTP}=useAuth();
    const [verifyData, setVerifyData]=useState<VerifyData>({
        email: "",
        otp: ""
    });

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setVerifyData(prev=>({
            ...prev,
            [name]: value
        }));
    }

    function handleVerifyOTP(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        verifyOTP(verifyData);
    }

    return(
        <div className="verification">
            <img src="/gifts.jpg" alt="img" className="verification-image"/>
            <img src="/cake.png" alt="img" className="verification-logo"/>
            <div className="verification-contents">
                <h1>Enter OTP</h1>
                <form onSubmit={handleVerifyOTP}>
                    <Input type="email" name="email" value={verifyData.email} inputFunction={handleInputChange} text="Email"/>
                    <Input type="text" name="otp" value={verifyData.otp} inputFunction={handleInputChange} text="OTP"/>
                    <AuthButton text="Verify"/>
                </form>
            </div>
        </div>
    )
}