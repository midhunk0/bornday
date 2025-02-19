import React from "react";
import "./Input.css";

interface InputProps{
    type: "text" | "password" | "email" | "date";
    name: string;
    value: string;
    inputFunction: (e: React.ChangeEvent<HTMLInputElement>)=>void;
    text: string;
    disable?: boolean;
}

export function Input({type, name, value, inputFunction, text, disable=false}: InputProps){
    return(
        <div className="input-container">
            <input disabled={disable} type={type} name={name} value={value} onChange={inputFunction} required placeholder=" "/>
            <label>{text}</label>
        </div>
    )
}