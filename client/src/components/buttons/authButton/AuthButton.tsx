import "./AuthButton.css";

interface AuthButtonProps{
    text: string
}

export function AuthButton({ text }: AuthButtonProps ){
    return(
        <button type="submit" className="authButton">
            <div className="authButton-icon-wrapper">
                <img src="/arrow.png" alt="icon"/>
            </div>
            {text}
        </button>
    )
}