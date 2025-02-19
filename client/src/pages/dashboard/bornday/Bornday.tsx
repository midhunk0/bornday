import { useEffect, useState } from "react";
import "./Bornday.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../components/buttons/button/Button";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";

interface Bornday{
    name: string;
    date: string;
    imageUrl: string;
};

export function Bornday(){
    const navigate=useNavigate();
    const { borndayId }=useParams<{ borndayId: string }>() || "";

    const apiUrl=import.meta.env.MODE==="development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;

    const [bornday, setBornday]=useState<Bornday>({
        name: "",
        date: "",
        imageUrl: ""
    });
    const [showConfirm, setShowConfirm]=useState(false);

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
                    data.date=data.date.split("T")[0];
                    setBornday(data)
                    // toast.success(result.message);
                }
                else{
                    toast.error(result.message);
                }
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
        setShowConfirm(false);

        try{
            const response=await fetch(`${apiUrl}/deleteBornday/${borndayId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                navigate("/dashboard/borndays");
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
  
    return(
        <div className={`bornday ${showConfirm ? "blur" : ""}`}>
            <h1>Bornday</h1>
            <div className="bornday-div">
                <div className="bornday-user">
                    <img src={bornday.imageUrl ? bornday.imageUrl : "/profile.png"} alt="img"/>
                    <div className="bornday-detail">
                        <h2>{bornday.name}</h2>
                        <h4>{bornday.date}</h4>
                    </div>
                </div>
                <Button type="button" text="Edit" functionName={()=>updateBornday(borndayId!)} imageUrl="/edit.png" imageClassName="edit-icon"/>
                <Button className="delete" type="button" text="Delete" functionName={()=>setShowConfirm(true)} imageUrl="/delete.png" imageClassName="delete-icon"/>
            </div>
            {showConfirm && (
                <ConfirmPopup
                    text={`Are you sure to delete bornday of ${bornday.name}?`}
                    onYes={deleteBornday} onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    )
}