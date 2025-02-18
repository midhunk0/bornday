import React from "react";
import "./ConfirmPopup.css";

interface ConfirmPopupProps{
    text: string;
    onYes: (e: React.MouseEvent)=>void;
    onNo: ()=>void
};

export function ConfirmPopup({text, onYes, onNo}: ConfirmPopupProps){
    return(
        <div className="confirmPopup">
            <p>{text}</p>
            <div className="confirmPopup-buttons">
                <button onClick={onYes} className="confirmPopup-yes">Yes</button>
                <button onClick={onNo} className="confirmPopup-no">No</button>
            </div>
        </div>
    )
}