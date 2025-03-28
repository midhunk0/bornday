import React, { useState } from "react";
import "./BorndayItem.css";

interface Bornday{
    _id: string;
    name: string;
    date: string;
    imageUrl: string;
}

interface BorndayProps{
    bornday: Bornday;
    open: boolean;
    onView: (e: React.MouseEvent, id: string)=>void;
    onEdit: (e: React.MouseEvent, id: string)=>void;
    onSetId: (e: React.MouseEvent, id: string)=>void;
    onToggle: (e: React.MouseEvent, id: string)=>void;
    onSetConfirm: (e: React.MouseEvent, id: string)=>void;
}

export function BorndayItem({ bornday, open, onView,  onEdit, onSetId, onToggle, onSetConfirm }: BorndayProps){
    const [imageLoaded, setImageLoaded]=useState(false);

    function formatDate(dateString: string){
        const date=new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    return(
        <div className="borndayItem" onClick={(e)=>onView(e, bornday._id)}>
            <div className="borndayItem-details">
                {!imageLoaded && <div className="borndays-item-image-skeleton"/>}
                <img src={bornday.imageUrl ? bornday.imageUrl : "/profile.png"} alt="image" onLoad={()=>setImageLoaded(true)} className={imageLoaded ? "" : "hidden"}/>
                <div className="borndayItem-content">
                    <p>{bornday.name}</p>
                    <p>{formatDate(bornday.date)}</p>
                </div>
            </div>
            <div className="borndayItem-buttons">
                {open && (
                    <>
                        <div className="borndayItem-icon-wrapper" onClick={(e)=>{e.stopPropagation(); onEdit(e, bornday._id)}}>
                            <img src="/edit.png" alt="image" className="borndayItem-icon-edit"/>
                        </div>
                        <div className="borndayItem-icon-wrapper" onClick={(e)=>{e.stopPropagation(); onSetId(e, bornday._id); onSetConfirm(e, bornday._id)}}>
                            <img src="/delete.png" alt="image" className="borndayItem-icon-delete"/>
                        </div>
                    </>
                )}
                <div className="borndayItem-icon-wrapper" onClick={(e)=>{e.preventDefault(); onToggle(e, bornday._id)}}>
                    <img src={open ? "/right.png" : "/left.png"} alt="image" className={open ? "borndayItem-icon-right" : "borndayItem-icon-left"}/>
                </div>
            </div>
        </div>
    )
}
