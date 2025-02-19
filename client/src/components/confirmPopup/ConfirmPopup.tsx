import React from "react";
import "./ConfirmPopup.css";
import { Button } from "../buttons/button/Button";

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
                <Button type="button"className="delete"functionName={onYes} text="Yes"imageUrl="/yes.png"imageClassName="yes-icon"/>
                <Button type="button"functionName={onNo}text="No"imageUrl="/no.png"imageClassName="no-icon"/>
            </div>
        </div>
    )
}