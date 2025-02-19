import React from "react";
import "./Button.css";

interface ButtonProps{
    type?: "button" | "submit";
    className?: string;
    functionName?: (e: React.MouseEvent)=>void;
    text?: string;
    imageUrl: string;
    imageClassName: string;
}

export function Button({ type="button", className="", functionName=()=>{}, text="", imageUrl, imageClassName }: ButtonProps){
    return(
        <button type={type} className={`button ${className}`} onClick={functionName}>
            {text}
            <div className="button-icon-wrapper">
                <img src={imageUrl} alt="img" className={imageClassName}/>
            </div>
        </button>   
    )
}