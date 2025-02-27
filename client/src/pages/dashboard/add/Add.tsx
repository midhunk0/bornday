import React, { useRef, useState } from "react";
import "./Add.css";
import { useLocation } from "react-router-dom";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";
import { useBorndays } from "../../../hooks/useBorndays";

interface BorndayData{
    name: string,
    date: string,
    image: File | null
};

export function Add(){
    const location=useLocation();

    const { addBornday }=useBorndays();
    const fileInputRef=useRef<HTMLInputElement>(null);
    const [borndayData, setBorndayData]=useState<BorndayData>({
        name: "",
        date: (location.state as { date?: string })?.date || new Date().toISOString().split("T")[0],
        image: null
    });

    function handleInputChange(e:React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setBorndayData(prev=>({
            ...prev,
            [name]: value
        }));
    };

    function handleAddImage(e: React.ChangeEvent<HTMLInputElement>){
        const file=e.target.files?.[0] || null;
        setBorndayData(prev=>({
            ...prev,
            image: file
        }))
    }

    function handleRemoveImage(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        setBorndayData(prev=>({
            ...prev,
            image: null
        }));

        if(fileInputRef.current){
            fileInputRef.current.value="";
        }
    }

    async function handleAdd(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", borndayData.name);
        formData.append("date", borndayData.date);
        if (borndayData.image) {
            formData.append("image", borndayData.image);
        }
    
        await addBornday(formData);
    }

    return(
        <div className="add">
            <h1>Add Bornday</h1>
            <form onSubmit={handleAdd} className="add-form">
                <Input type="file" name="image" inputFunction={handleAddImage} text="Profile" ref={fileInputRef}/>
                {borndayData.image ? (
                    <div className="add-image-section">
                        <img src={borndayData.image ? URL.createObjectURL(borndayData.image) : ""} alt="image" className="add-image"/>
                        <button type="button" onClick={handleRemoveImage} className="add-remove"><img src="/no.png" alt="img"/></button>
                    </div>
                ) : (
                    <></>
                )}
                <Input type="text" name="name" value={borndayData.name} inputFunction={handleInputChange} text="Name"/>
                <Input type="date" name="date" value={borndayData.date} inputFunction={handleInputChange} text="DOB"/>
                <Button type="submit"text="Add"imageUrl="/add.png"imageClassName="add-icon"/>
            </form>
        </div>
    );
};