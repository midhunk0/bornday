import React, { useEffect, useRef, useState } from "react";
import "./Update.css";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";
import { useBorndays } from "../../../hooks/useBorndays";
import { toast } from "react-toastify";

interface BorndayData{
    name: string;
    image: File | null;
    date: string;
};

export function Update(){
    const { borndayId }=useParams<{ borndayId: string }>();
    const { bornday, fetchBornday, updateBornday }=useBorndays();
    const fileInputRef=useRef<HTMLInputElement>(null);
    const [isNewImage, setIsNewImage]=useState(false);
    const [updateData, setUpdateData]=useState<BorndayData>({
        name: "",
        image: null,
        date: ""
    });

    useEffect(()=>{
        if(borndayId){
            fetchBornday(borndayId);
        }
    }, [borndayId]);

    useEffect(()=>{
        if(bornday && !updateData.name && !updateData.date){
            setUpdateData({
                name: bornday.name,
                image: bornday.imageUrl ? new File([], bornday.imageUrl) : null,
                date: bornday.date
            })
        }
    }, [bornday, updateData.date, updateData.name]);

    function handleAddImage(e: React.ChangeEvent<HTMLInputElement>){
        const file=e.target.files?.[0] || null;
        setUpdateData(prev=>({
            ...prev,
            image: file
        }))
        setIsNewImage(true);
    }

    useEffect(()=>{
        console.log(updateData)
    }, [updateData])

    function handleRemoveImage(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        setUpdateData(prev=>({
            ...prev,
            image: null
        }));

        if(fileInputRef.current){
            fileInputRef.current.value="";
        }
    }

    function handleUpdate(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(!borndayId){
            toast.error("Bornday ID is not defined");
            return;
        }
        const formData = new FormData();
        formData.append("name", updateData.name);
        formData.append("date", updateData.date);
        if (updateData.image) {
            formData.append("image", updateData.image);
        }
        updateBornday(borndayId, formData);
    };

    return(
        <div className="update">
            <h1>Update Bornday</h1>
            <form onSubmit={handleUpdate} className="update-form">
                {updateData.image ? (
                    <div className="update-image-section">
                        {isNewImage 
                            ? <img src={updateData.image ? URL.createObjectURL(updateData.image) : ""} alt="image" className="update-image"/>
                            : <img src={updateData.image.name} alt="image" className="update-image"/>
                        }
                        <button type="button" onClick={handleRemoveImage} className="update-remove"><img src="/no.png" alt="img"/></button>
                    </div>
                ) : (
                    <Input type="file" name="image" inputFunction={handleAddImage} text="Profile" ref={fileInputRef}/>
                )}
                <Input type="text" name="name" value={updateData.name} inputFunction={(e)=>setUpdateData({...updateData, name: e.target.value})} text="Name"/>
                <Input type="date" name="date" value={updateData.date} inputFunction={(e)=>setUpdateData({...updateData, date: e.target.value})} text="DOB"/>
                <Button type="submit" text="Update" imageUrl="/update.png" imageClassName="update-icon"/>
            </form>
        </div>
    )
}