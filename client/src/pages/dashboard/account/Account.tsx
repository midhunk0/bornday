import React, { useEffect, useState } from "react";
import "./Account.css";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";
import { Button } from "../../../components/buttons/button/Button";
import { Input } from "../../../components/input/Input";
import { useAuth } from "../../../hooks/useAuth";

export function Account(){
    const { logout, fetchUser, userData, updateUser, deleteAccount }=useAuth();

    const [updateData, setUpdateData]=useState(userData || {});
    const [enableEdit, setEnableEdit]=useState(false);
    const [showConfirm, setShowConfirm]=useState(false);

    useEffect(()=>{
        async function getUser(){
            await fetchUser();
        }
        getUser();
    }, []);

    useEffect(()=>{
        if(userData){
            setUpdateData(userData);    
        }
    }, [userData]);
    
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setUpdateData((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    async function handleUpdate(e: React.FormEvent){
        e.preventDefault();
        const result=await updateUser(updateData);
        if(result){
            setEnableEdit(false);
        }
    };

    function handleLogout(){
        logout();
    };

    function handleDelete(){
        deleteAccount();
    };

    return(
        <div className={`account ${showConfirm ? "blur" : ""}`}>
            <h1>Account</h1>
            <form className="account-form" onSubmit={handleUpdate}>
                <Input disable={!enableEdit} type="text" name="username" value={updateData.username} inputFunction={handleInputChange} text="Username"/>
                <Input disable={!enableEdit} type="email" name="email" value={updateData.email} inputFunction={handleInputChange} text="Email"/>
                {enableEdit ? 
                    <Button type="button" text="Update User" functionName={handleUpdate}  imageUrl="/update.png" imageClassName="update-icon"/>
                : 
                    <Button type="button"text="Edit User"functionName={()=>setEnableEdit(!enableEdit)} imageUrl="/edit.png"imageClassName="edit-icon"/>
                }
                <Button type="button"text="Logout"functionName={handleLogout}imageUrl="/logout.png"imageClassName="logout-icon"/>
                <Button type="button"className="delete"text="Delete Account"functionName={()=>setShowConfirm(true)}imageUrl="/delete.png"imageClassName="delete-icon"/>
            </form>
            {showConfirm && (
                <ConfirmPopup
                    text="Are you sure to delete account?"
                    onYes={handleDelete} onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    )
}