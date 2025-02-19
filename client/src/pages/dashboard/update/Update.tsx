import React, { useEffect, useState } from "react";
import "./Update.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";

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

    const [updateData, setUpdateData]=useState<BorndayData>({
        name: "",
        date: ""
    });

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
                    // toast.success(result.message);
                }
                else{
                    toast.error(result.message);
                }
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