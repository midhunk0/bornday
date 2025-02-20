import React, { useEffect, useState } from "react";
import "./Update.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";
import { useFetchBornday } from "../../../hooks/useFetchBornday";

interface BorndayData{
    name: string;
    date: string;
};

export function Update(){
    const navigate=useNavigate();
    const { borndayId }=useParams<{ borndayId: string }>();

    const apiUrl=import.meta.env.MODE==="development" 
        ? import.meta.env.VITE_APP_DEV_URL 
        : import.meta.env.VITE_APP_PROD_URL;

    const { bornday }=useFetchBornday(apiUrl, borndayId || "");    
    const [updateData, setUpdateData]=useState<BorndayData>({
        name: "",
        date: ""
    });

    useEffect(()=>{
        if(bornday){
            setUpdateData({
                name: bornday.name,
                date: bornday.date
            })
        }
    }, [apiUrl, bornday]);

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
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
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
                <Input type="text" name="name" value={updateData.name} inputFunction={(e)=>setUpdateData({...updateData, name: e.target.value})} text="Name"/>
                <Input type="date" name="date" value={updateData.date} inputFunction={(e)=>setUpdateData({...updateData, date: e.target.value})} text="DOB"/>
                <Button type="submit" text="Update" imageUrl="/update.png" imageClassName="update-icon"/>
            </form>
        </div>
    )
}