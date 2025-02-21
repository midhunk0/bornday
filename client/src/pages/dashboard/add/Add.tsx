import React, { useState } from "react";
import "./Add.css";
import { useLocation } from "react-router-dom";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";
import { useBorndays } from "../../../hooks/useBorndays";

interface BorndayData{
    name: string,
    date: string
};

export function Add(){
    const location=useLocation();

    const { addBornday }=useBorndays();
    const [borndayData, setBorndayData]=useState<BorndayData>({
        name: "",
        date: (location.state as { date?: string })?.date || new Date().toISOString().split("T")[0]
    });

    function handleInputChange(e:React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setBorndayData(prev=>({
            ...prev,
            [name]: value
        }));
    };

    async function handleAdd(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        addBornday(borndayData);
    }

    return(
        <div className="add">
            <h1>Add Bornday</h1>
            <form onSubmit={handleAdd} className="add-form">
                <Input type="text" name="name" value={borndayData.name} inputFunction={handleInputChange} text="Name"/>
                <Input type="date" name="date" value={borndayData.date} inputFunction={handleInputChange} text="DOB"/>
                <Button type="submit"text="Add"imageUrl="/add.png"imageClassName="add-icon"/>
            </form>
        </div>
    );
};