import React, { useEffect, useState } from "react";
import "./Bornday.css";
import { useNavigate, useParams } from "react-router-dom";

interface BorndayData{
    name: string;
    date: string;
};

export function Bornday(){
    const [borndayData, setBorndayData]=useState<BorndayData>({
        name: "",
        date: ""
    });

    const { borndayId }=useParams<{ borndayId: string }>() || "";
    const environment=import.meta.env.MODE;
    const apiUrl=environment==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL
    const navigate=useNavigate();

    useEffect(()=>{
        async function fetchBornday(){
            try{
                const response=await fetch(`${apiUrl}/fetchBornday/${borndayId}`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    const data=result.bornday;
                    data.date=data.date.split("T")[0]
                    setBorndayData(data);
                }
                console.log(result.message);
            }
            catch(error){
                if(error instanceof Error){
                    console.log("Error while fetching bornday: ", error.message);
                }
                else{
                    console.log("An unknown error occurred");
                }
            }
        }

        fetchBornday();
    }, [apiUrl, borndayId]);

    function updateBornday(borndayId: string){
        navigate(`/dashboard/update/${borndayId}`);
    };

    async function deleteBornday(){
        try{
            const response=await fetch(`${apiUrl}/deleteBornday/${borndayId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/dashboard/borndays");
            }
            console.log(result.message);
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
        <div className="bornday">
            <h1>Bornday</h1>
            <div className="bornday-div">
                <div className="bornday-details">
                    <h3>{borndayData.name}</h3>
                    <h6>{borndayData.date}</h6>
                </div>
                <button type="button" className="bornday-button" onClick={()=>updateBornday(borndayId!)}>
                    Edit 
                    <div className="bornday-icon-wrapper">
                        <img src="/edit.png" alt="img" className="bornday-icon-edit"/>
                    </div>
                </button>
                <button type="button" className="bornday-button" onClick={deleteBornday}>
                    Delete 
                    <div className="bornday-icon-wrapper">
                        <img src="/delete.png" alt="img" className="bornday-icon-delete"/>
                    </div>
                </button>
            </div>
        </div>
    )
}