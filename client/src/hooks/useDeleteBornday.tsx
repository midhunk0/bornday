import { toast } from "react-toastify";

export function useDeleteBornday(apiUrl: string){
    async function deleteBornday(borndayId: string, onDeleteSuccess: (borndayId: string)=>void){
        try{
            const response=await fetch(`${apiUrl}/deleteBornday/${borndayId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                onDeleteSuccess(borndayId);
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

    return { deleteBornday };
}