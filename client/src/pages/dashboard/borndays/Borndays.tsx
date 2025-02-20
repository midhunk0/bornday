import React, { useState } from "react";
import "./Borndays.css";
import { useNavigate } from "react-router-dom";
import { BorndayItem } from "../../../components/borndayItem/BorndayItem";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";
import { useBorndays } from "../../../hooks/useBorndays";

export function Borndays(){
    const navigate=useNavigate();

    const { borndays, setBorndays, deleteBornday }=useBorndays();
    const [openButtons, setOpenButtons]=useState<{ [key: string]: boolean }>({});
    const [borndayId, setBorndayId]=useState("");
    const [showConfirm, setShowConfirm]=useState(false);

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

    async function handleDelete(e: React.FormEvent, borndayId: string){
        e.stopPropagation();
        e.preventDefault();
        setShowConfirm(false);
        await deleteBornday(borndayId, (borndayId)=>{
            setBorndays((prev)=>prev.filter((bornday)=>bornday._id!==borndayId));
        })
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
                    onYes={(e)=>handleDelete(e, borndayId)} onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    );
};