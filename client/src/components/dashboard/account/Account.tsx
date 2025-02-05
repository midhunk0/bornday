import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";

export function Account(){
    const [userData, setUserData]=useState({
        _id: "",
        username: "",
        email: ""
    });
    const [enableEdit, setEnableEdit]=useState(false);

    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development"
        ? import.meta.env.VITE_APP_DEV_URL 
        : import.meta.env.VITE_APP_PROD_URL
    const navigate=useNavigate();

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
                }
                console.log(result.message);
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

    function toggleEdit(){
        setEnableEdit((prev)=>!prev);
    }

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
            console.log(result);
            if(response.ok){
                if(!result.verified){
                    navigate("/verify");
                }
                setEnableEdit(false);
            }
            console.log(result.message);
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
                console.log(result.message);
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

    async function handleDelete(e: React.FormEvent){
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
                console.log(result.message);
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
        <div className="account">
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
                    <button type="button" onClick={handleUpdate}>Update User</button>
                : 
                    <button type="button" onClick={toggleEdit}>Edit User</button>
                }
            </form>
            <div className="account-buttons">
                <button type="button" onClick={handleLogout}>Logout</button>
                <button type="button" onClick={handleDelete}>Delete Account</button>
            </div>
        </div>
    )
}