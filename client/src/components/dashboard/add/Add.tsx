import React, { useState } from "react";
import "./Add.css";
import { useNavigate, useLocation } from "react-router-dom";

interface BorndayData{
    name: string,
    date: string
};

export function Add(){
    const location=useLocation();
    const [borndayData, setBorndayData]=useState<BorndayData>({
        name: "",
        date: (location.state as { date?: string })?.date || new Date().toISOString().split("T")[0]
    });

    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development"
        ? import.meta.env.VITE_APP_DEV_URL 
        : import.meta.env.VITE_APP_PROD_URL
    const navigate=useNavigate();

    function handleInputChange(e:React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setBorndayData(prevState=>({
            ...prevState,
            [name]: value
        }));
    };

    async function addBornday(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/addBornday`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(borndayData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/dashboard/borndays");
            }
            console.log(result.message);
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.log("Error during adding: ", error.message);
            }
            else{
                console.error("An unknown error occurred");
            }
        }
    }

    return(
        <div className="add">
            <h1>Add Bornday</h1>
            <form onSubmit={addBornday} className="add-form">
                <div className="input-container">
                    <input type="text" name="name" value={borndayData.name} required onChange={handleInputChange} placeholder=" "/>
                    <label>Name</label>
                </div>
                <div className="input-container">
                    <input type="date" name="date" value={borndayData.date} required onChange={handleInputChange} placeholder=" "/>
                    <label>DOB</label>
                </div>
                <button type="submit" className="add-button">
                    Add
                    <span className="add-button-icon-wrapper">
                        <img src="/add.png" alt="img" className="add-button-icon"/>
                    </span>
                </button>
            </form>
        </div>
    );
};