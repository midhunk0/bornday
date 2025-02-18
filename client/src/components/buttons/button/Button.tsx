import "./Button.css";

interface ButtonProps{
    type: "button" | "submit";
    className?: string;
    functionName?: ()=>void;
    text: string;
    imageUrl: string;
    imageClassName: string;
}

export function Button({ type, className="", functionName, text, imageUrl, imageClassName }: ButtonProps){
    return(
        <button type={type} className={`button ${className}`} onClick={functionName}>
            {text}
            <div className="button-icon-wrapper">
                <img src={imageUrl} alt="img" className={imageClassName}/>
            </div>
        </button>   
    )
}