import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Account(){
    const navigate=useNavigate();
    
    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL 
        : import.meta.env.VITE_APP_PROD_URL;

    const [userData, setUserData]=useState({
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

    async function handleUpdate(e: React.FormEvent){
        e.preventDefault();
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

    async function handleLogout(e: React.FormEvent){
        e.preventDefault();
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

    async function deleteAccount(e: React.FormEvent){
        try{
            e.preventDefault();
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
            <form className="account-form">
                <div className="input-container">
                    <input disabled={!enableEdit} type="text" name="username" value={userData.username} required onChange={handleInputChange} placeholder=" "/>
                    <label>Username</label>
                </div>
                <div className="input-container">
                    <input disabled={!enableEdit} type="email" name="email" value={userData.email} required onChange={handleInputChange} placeholder=" "/>
                    <label>Email</label>
                </div>
                {enableEdit ? 
                    <button type="button" className="account-button" onClick={handleUpdate}>
                        Update User
                        <div className="account-icon-wrapper">
                            <img src="/update.png" alt="img" className="account-icon-update"/>
                        </div>
                    </button>
                : 
                    <button type="button" className="account-button" onClick={()=>setEnableEdit(!enableEdit)}>
                        Edit User
                        <div className="account-icon-wrapper">
                            <img src="/edit.png" alt="img" className="account-icon-edit"/>
                        </div>
                    </button>
                }
                <button type="button" onClick={handleLogout} className="account-button">
                    Logout
                    <div className="account-icon-wrapper">
                        <img src="/logout.png" alt="img" className="account-icon-logout"/>
                    </div>
                </button>
                <button type="button" onClick={()=>setShowConfirm(true)} className="account-button delete">
                    Delete Account
                    <div className="account-icon-wrapper delete">
                        <img src="/delete.png" alt="img" className="account-icon-delete"/>
                    </div>
                </button>
            </form>
            {showConfirm && (
                <div className="account-confirm-popup">
                    <p>Are you sure to delete account?</p>
                    <div className="account-confirm-buttons">
                        <button onClick={deleteAccount} className="account-confirm-yes">Yes</button>
                        <button onClick={()=>setShowConfirm(false)} className="account-confirm-no">No</button>
                    </div>
                </div>
            )}
        </div>
    )
}