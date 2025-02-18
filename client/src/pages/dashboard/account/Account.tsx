import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";
import { Button } from "../../../components/buttons/button/Button";

interface UserData{
    _id: string;
    username: string;
    email: string;
}

export function Account(){
    const navigate=useNavigate();
    
    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL 
        : import.meta.env.VITE_APP_PROD_URL;

    const [userData, setUserData]=useState<UserData>({
        _id: "",
        username: "",
        email: ""
    });
    const [enableEdit, setEnableEdit]=useState(false);
    const [showConfirm, setShowConfirm]=useState(false);

    useEffect(()=>{
        async function fetchUser(){
            try{
                const response=await fetch(`${apiUrl}/fetchUser`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setUserData(result.user);
                    // toast.success(result.message);
                }
                else{
                    toast.error(result.message);
                }
            }
            catch(error: unknown){
                if(error instanceof Error){
                    console.log("Error while fetching data: ", error.message);
                }
                else{
                    console.log("An unknown error occurred");
                }
            }
        }

        fetchUser();
    }, [apiUrl]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value }=e.target;
        setUserData((prev)=>({
            ...prev,
            [name]: value
        }))
    }

    async function handleUpdate(){
        try{
            const response=await fetch(`${apiUrl}/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                if(!result.verified){
                    navigate("/verify");
                }
                setEnableEdit(false);
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.log("Error while updating: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    };

    async function handleLogout(){
        try{
            const response=await fetch(`${apiUrl}/logoutUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/")
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while logout: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    };

    async function deleteAccount(){
        try{
            const response=await fetch(`${apiUrl}/deleteUser`, { 
                method: "delete",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/register");
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while deleting user: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    };

    return(
        <div className={`account ${showConfirm ? "blur" : ""}`}>
            <h1>Account</h1>
            <form className="account-form" onSubmit={handleUpdate}>
                <div className="input-container">
                    <input disabled={!enableEdit} type="text" name="username" value={userData.username} required onChange={handleInputChange} placeholder=" "/>
                    <label>Username</label>
                </div>
                <div className="input-container">
                    <input disabled={!enableEdit} type="email" name="email" value={userData.email} required onChange={handleInputChange} placeholder=" "/>
                    <label>Email</label>
                </div>
                {enableEdit ? 
                    <Button
                        type="button"
                        text="Update User"
                        functionName={handleUpdate} 
                        imageUrl="/update.png"
                        imageClassName="update-icon"
                    />
                : 
                    <Button 
                        type="button"
                        text="Edit User"
                        functionName={()=>setEnableEdit(!enableEdit)} 
                        imageUrl="/edit.png"
                        imageClassName="edit-icon"
                    />
                }
                <Button 
                    type="button"
                    text="Logout"
                    functionName={handleLogout}
                    imageUrl="/logout.png"
                    imageClassName="logout-icon"
                />
                <Button 
                    type="button"
                    className="delete"
                    text="Delete Account"
                    functionName={()=>setShowConfirm(true)}
                    imageUrl="/delete.png"
                    imageClassName="delete-icon"
                />
            </form>
            {showConfirm && (
                <ConfirmPopup
                    text="Are you sure to delete account?"
                    onYes={deleteAccount}
                    onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    )
}