import React, { useState } from "react";
import "./Password.css";
import { Input } from "../input/Input";

interface PasswordProps{
    name: string;
    value: string;
    inputFunction: (e: React.ChangeEvent<HTMLInputElement>)=>void;
}

export function Password({name, value, inputFunction}: PasswordProps){
    const [visible, setVisible]=useState(false);
    
    return(
        <div className="password">
            <Input type={visible ? "text" : "password"} name={name} value={value} inputFunction={inputFunction} text="Password"/>
            <div className={`password-img-container ${visible ? "visible" : ""}`} onClick={()=>setVisible(!visible)}>
                <img src={visible ? "visible.png" : "visible_off.png"} alt="image"/>
            </div>
        </div>
    )
}