import { useEffect, useState } from "react";
import "./Bornday.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../components/buttons/button/Button";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";
import { useBorndays } from "../../../hooks/useBorndays";

export function Bornday(){
    const navigate=useNavigate();
    const { borndayId }=useParams<{ borndayId: string }>();
    const [loading, setLoading]=useState(true);
    const { bornday, fetchBornday, deleteBornday, setBorndays }=useBorndays();
    const [showConfirm, setShowConfirm]=useState(false);

    useEffect(()=>{
        if(borndayId){
            fetchBornday(borndayId).then(()=> setLoading(false));
        }
    }, [borndayId]);
    

    function updateBornday(borndayId: string){
        navigate(`/dashboard/update/${borndayId}`);
    };

    async function handleDelete(){
        if(!borndayId){
            toast.error("Bornday ID is not defined");
            return;
        }
        setShowConfirm(false);
        await deleteBornday(borndayId, (borndayId)=>{
            setBorndays((prev)=>prev.filter((bornday)=>bornday._id!==borndayId));
            navigate("/dashboard/borndays");
        })
    }

    if(loading){
        return <div>Loading...</div>
    }

    return(
        <div className={`bornday ${showConfirm ? "blur" : ""}`}>
            <h1>Bornday</h1>
            <div className="bornday-div">
                <div className="bornday-user">
                    {bornday.imageUrl && (
                        <img src={bornday.imageUrl} alt="img"/>
                    )}
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
                    onYes={handleDelete} onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    )
}