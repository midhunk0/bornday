import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Bornday {
    _id: string;
    name: string;
    date: string;
    imageUrl: string;
}

interface UpdataDataProps{
    name: string;
    date: string;
}

interface Notification{
    _id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

type Borndays=Bornday[];
type Notifications=Notification[];

export function useBorndays(){
    const navigate=useNavigate();
    const [borndays, setBorndays]=useState<Borndays>([]);
    const [bornday, setBornday]=useState<Bornday>({
        _id: "",
        name: "",
        date: "",
        imageUrl: "/profile.png",        
    });
    const [notifications, setNotifications]=useState<Notifications>([]);
    const [notificationsCount, setNotificationsCount]=useState(0);

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    async function addBornday(inputData: FormData){
        try{
            const response=await fetch(`${apiUrl}/addBornday`, {
                method: "POST",
                body: inputData,
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
                console.log("Error while adding bornday: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }
    
    useEffect(()=>{
        async function fetchBorndays(){
            try{
                const response=await fetch(`${apiUrl}/fetchBorndays`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setBorndays(result.borndays);
                }
                else{
                    toast.error(result.message);
                }
            }
            catch(error){
                if(error instanceof Error){
                    console.log("Error during fetching: ", error.message);
                }
                else{
                    console.log("An unknown error occurred");
                }
            }
        }

        fetchBorndays();
    }, [apiUrl]);

    async function fetchBornday(borndayId: string){
        try{
            const response=await fetch(`${apiUrl}/fetchBornday/${borndayId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                const data=result.bornday;
                data.date=data.date.split("T")[0];
                setBornday(data)
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
                console.log("An unknown error occurred");
            }
        }
    }

    async function deleteBornday(borndayId: string, onDeleteSuccess: (borndayId: string)=>void){
        try{
            const response=await fetch(`${apiUrl}/deleteBornday/${borndayId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                onDeleteSuccess(borndayId);
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while deleting bornday: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    async function updateBornday(borndayId: string, updateData: UpdataDataProps){
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
    }

    async function fetchNotifications(){
        try{
            const response=await fetch(`${apiUrl}/fetchNotifications`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })
            const result=await response.json();
            if(response.ok){
                setNotifications(result.notifications);
                setNotificationsCount(result.count);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while fetching notifications: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    useEffect(()=>{
        fetchNotifications();
    }, [apiUrl])

    async function readNotification(notificationId: string){
        try{
            const response=await fetch(`${apiUrl}/readNotification/${notificationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                fetchNotifications();
                setNotificationsCount(prev=>prev-1);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while reading notification")
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }

    return { 
        addBornday, 
        borndays, 
        setBorndays, 
        bornday, 
        fetchBornday, 
        updateBornday, 
        deleteBornday,
        notifications, 
        setNotifications,
        notificationsCount, 
        setNotificationsCount,
        readNotification
    };
};