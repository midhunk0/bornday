import React, { useState, useEffect } from "react";
import "./Borndays.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Bornday {
    _id: string;
    name: string;
    date: string;
    imageUrl: string;
}

type BorndayData = Bornday[];

export function Borndays(){
    const navigate=useNavigate();

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    const [borndays, setBorndays]=useState<BorndayData>([]);
    const [openButtons, setOpenButtons]=useState<{ [key: string]: boolean }>({});
    const [borndayId, setBorndayId]=useState("");
    const [showConfirm, setShowConfirm]=useState(false);

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
                    // toast.success(result.message);
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

    function formatDate(dateString: string){
        const date=new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    function toggleOpen(e: React.MouseEvent, id: string){
        e.stopPropagation();
        setOpenButtons((prev)=>({
            [id]: !prev[id]
        }));
    };

    function toBornday(e: React.FormEvent, borndayId: string){
        e.preventDefault();
        navigate(`/dashboard/bornday/${borndayId}`);
    }

    function updateBornday(e: React.MouseEvent, borndayId: string){
        e.stopPropagation();
        navigate(`/dashboard/update/${borndayId}`);
    };

    async function deleteBornday(e: React.FormEvent, borndayId: string){
        e.stopPropagation();
        e.preventDefault();

        setShowConfirm(false);
        try{
            const response=await fetch(`${apiUrl}/deleteBornday/${borndayId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setBorndays((prevBorndays) => prevBorndays.filter(bornday => bornday._id !== borndayId));
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

    return(
        <div className={`borndays ${showConfirm ? "blur" : ""}`}>
            <h1>Borndays.</h1>
            {borndays && borndays.length>0 ? (
                <div className="borndays-items">
                    {borndays.map((bornday)=>(
                        <div className="borndays-item" key={bornday._id} onClick={(e)=>toBornday(e, bornday._id)}>
                            <div className="borndays-item-details">
                                <img src={bornday.imageUrl ? bornday.imageUrl : "/profile.png"} alt="img" className="borndays-item-image"/>
                                <div className="borndays-item-content">
                                    <p>{bornday.name}</p>
                                    <p>{formatDate(bornday.date)}</p>
                                </div>
                            </div>
                            <div className="borndays-buttons">
                                {openButtons[bornday._id] && (
                                    <div className="borndays-icon-wrapper" onClick={(e)=>updateBornday(e, bornday._id)}>
                                        <img src="/edit.png" alt="img" className="borndays-icon-edit"/>
                                    </div>
                                )}
                                {openButtons[bornday._id] && (
                                    <div className="borndays-icon-wrapper" onClick={(e)=>(e.stopPropagation(), setBorndayId(bornday._id), setShowConfirm(true))}>
                                        <img src="/delete.png" alt="img" className="borndays-icon-delete"/>
                                    </div>
                                )}
                                <div className="borndays-icon-wrapper">
                                    <img src={openButtons[bornday._id] ? "/right.png" : "/left.png"} alt="img" className={openButtons[bornday._id] ? "borndays-icon-right" : "borndays-icon-left"} onClick={(e)=>toggleOpen(e, bornday._id)}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ):(
                <p>No borndays available</p>
            )}
            {showConfirm && (
                <div className="borndays-confirm-popup">
                    <p>Are you sure to delete bornday of {borndays.find(bornday => bornday._id === borndayId)?.name}?</p>
                    <div className="borndays-confirm-buttons">
                        <button onClick={(e)=>deleteBornday(e, borndayId)} className="borndays-confirm-yes">Yes</button>
                        <button onClick={()=>setShowConfirm(false)} className="borndays-confirm-no">No</button>
                    </div>
                </div>
            )}
        </div>
    );
};