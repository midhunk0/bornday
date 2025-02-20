import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Bornday {
    _id: string;
    name: string;
    date: string;
    imageUrl: string;
}

type BorndayData = Bornday[];

export function useFetchBorndays(apiUrl: string){
    const [borndays, setBorndays]=useState<BorndayData>([]);

    useEffect(()=>{
        async function fetchBorndays(){
            try{
                const response=await fetch(`${apiUrl}/fetchBorndays`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setBorndays(result.borndays);
                }
                else{
                    toast.error(result.message);
                }
            }
            catch(error){
                if(error instanceof Error){
                    console.log("Error during fetching: ", error.message);
                }
                else{
                    console.log("An unknown error occurred");
                }
            }
        }

        fetchBorndays();
    }, [apiUrl]);

    return { borndays, setBorndays };
};