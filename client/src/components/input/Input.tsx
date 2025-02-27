import React, { forwardRef } from "react";
import "./Input.css";

interface InputProps{
    type: "text" | "password" | "email" | "date" | "file";
    name: string;
    value?: string;
    inputFunction: (e: React.ChangeEvent<HTMLInputElement>)=>void;
    text: string;
    disable?: boolean;
}

export const Input=forwardRef<HTMLInputElement, InputProps>(
    ({ type, name, value, inputFunction, text, disable=false }, ref)=>{
        return (
            <div className="input-container">
                <input
                    disabled={disable}
                    type={type}
                    name={name}
                    value={type==="file" ? undefined : value}
                    onChange={inputFunction}
                    required={type!=="file"}
                    placeholder=" "
                    ref={ref} 
                />
                <label>{text}</label>
            </div>
        );
    }
);