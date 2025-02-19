import React, { useState, useEffect } from "react";
import "./Borndays.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BorndayItem } from "../../../components/borndayItem/BorndayItem";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";

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

    function onSetBorndayId(e: React.MouseEvent, borndayId: string){
        e.stopPropagation();
        setBorndayId(borndayId);
    }

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

    function onSetConfirm(e: React.MouseEvent, borndayId: string){
        e.stopPropagation();
        setShowConfirm(!showConfirm);
        setBorndayId(borndayId);
    }

    return(
        <div className={`borndays ${showConfirm ? "blur" : ""}`}>
            <h1>Borndays.</h1>
            {borndays && borndays.length>0 ? (
                <div className="borndays-items">
                    {borndays.map((bornday)=>(
                        <BorndayItem 
                            key={bornday._id}
                            bornday={bornday}
                            open={openButtons[bornday._id] || false}
                            onView={toBornday}
                            onEdit={updateBornday}
                            onSetId={onSetBorndayId}
                            onToggle={toggleOpen}
                            onSetConfirm={onSetConfirm}
                        />
                    ))}
                </div>
            ):(
                <p>No borndays available</p>
            )}
            {showConfirm && (
                <ConfirmPopup
                    text={`Are you sure to delete ${borndays.find(bornday=>bornday._id===borndayId)?.name}`}
                    onYes={(e)=>deleteBornday(e, borndayId)} onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    );
};