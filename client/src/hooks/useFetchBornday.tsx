import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Bornday{
    _id: string;
    name: string;
    date: string;
    imageUrl: string;
};

export function useFetchBornday(apiUrl: string, borndayId: string){
    const [bornday, setBornday]=useState<Bornday>({
        _id: "",
        name: "",
        date: "",
        imageUrl: ""
    });

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

    return { bornday, setBornday };
}