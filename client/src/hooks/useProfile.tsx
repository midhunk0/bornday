import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UserData{
    _id: string;
    username: string;
    email: string;
}

interface UpdateUserProps{
    username: string;
    email: string;
}

export function useProfile(){
    const navigate=useNavigate();
    const [userData, setUserData]=useState<UserData>({
        _id: "",
        username: "",
        email: ""
    })

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

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

    async function updateUser(updateUserData: UpdateUserProps){
        try{
            const response=await fetch(`${apiUrl}/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateUserData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                if(!result.verified){
                    navigate("/verify");
                }
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
            return response;
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.log("Error while updating: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

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
    
    return { userData, updateUser, deleteAccount }
}