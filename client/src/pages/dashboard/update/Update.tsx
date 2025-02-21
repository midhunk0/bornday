import React, { useEffect, useState } from "react";
import "./Update.css";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";
import { useBorndays } from "../../../hooks/useBorndays";
import { toast } from "react-toastify";

interface BorndayData{
    name: string;
    date: string;
};

export function Update(){
    const { borndayId }=useParams<{ borndayId: string }>();
    const { bornday, fetchBornday, updateBornday }=useBorndays();
    const [updateData, setUpdateData]=useState<BorndayData>({
        name: "",
        date: ""
    });

    useEffect(()=>{
        if(borndayId){
            fetchBornday(borndayId);
        }
    }, [borndayId, fetchBornday]);

    useEffect(()=>{
        if(bornday && !updateData.name && !updateData.date){
            setUpdateData({
                name: bornday.name,
                date: bornday.date
            })
        }
    }, [bornday, updateData.date, updateData.name]);

    function handleUpdate(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(!borndayId){
            toast.error("Bornday ID is not defined");
            return;
        }
        updateBornday(borndayId, updateData);
    };

    return(
        <div className="update">
            <h1>Update Bornday</h1>
            <form onSubmit={handleUpdate} className="update-form">
                <Input type="text" name="name" value={updateData.name} inputFunction={(e)=>setUpdateData({...updateData, name: e.target.value})} text="Name"/>
                <Input type="date" name="date" value={updateData.date} inputFunction={(e)=>setUpdateData({...updateData, date: e.target.value})} text="DOB"/>
                <Button type="submit" text="Update" imageUrl="/update.png" imageClassName="update-icon"/>
            </form>
        </div>
    )
}