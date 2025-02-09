import React, { useEffect, useState } from "react";
import "./Update.css";
import { useNavigate, useParams } from "react-router-dom";

interface BorndayData{
    name: string;
    date: string;
};

export function Update(){
    const [updateData, setUpdateData]=useState<BorndayData>({
        name: "",
        date: ""
    });
    const { borndayId }=useParams<{ borndayId: string }>();

    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development" 
        ? import.meta.env.VITE_APP_DEV_URL 
        : import.meta.env.VITE_APP_PROD_URL
    const navigate=useNavigate();

    useEffect(()=>{
        async function fetchBornday(){
            try{
                const response=await fetch(`${apiUrl}/fetchBornday/${borndayId}`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    const data=result.bornday;
                    data.date=data.date.split("T")[0];
                    setUpdateData(data);
                }
                console.log(result.message);
            }
            catch(error){
                if(error instanceof Error){
                    console.log("Error while fetching bornday: ", error.message);
                }
                else{
                    console.error("An unknown error occurred");
                }
            }
        }

        fetchBornday();
    }, [apiUrl, borndayId]);

    async function updateBornday(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/editBornday/${borndayId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/dashboard/borndays");
            }
            console.log(result.message);
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while updating bornday: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    };

    return(
        <div className="update">
            <h1>Update Bornday</h1>
            <form onSubmit={updateBornday} className="update-form">
                <div className="input-container">
                    <input type="text" name="name" value={updateData.name} required onChange={(e)=>setUpdateData({ ...updateData, name: e.target.value })} placeholder=" "/>
                    <label>Name</label>
                </div>
                <div className="input-container">
                    <input type="date" name="date" value={updateData.date} required onChange={(e)=>setUpdateData({ ...updateData, date: e.target.value })} placeholder=" "/>
                    <label>DOB</label>
                </div>
                <button type="submit" className="update-button">
                    Update
                    <div className="update-button-icon-wrapper">
                        <img src="/update.png" alt="img" className="update-button-icon"/>
                    </div>
                </button>
            </form>
        </div>
    )
}