import { useBorndays } from "../../../hooks/useBorndays";
import "./Notifications.css";

export function Notifications(){
    const { notifications, readNotification }=useBorndays();

    function formatDate(dateString: string){
        const date=new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
        });
    }

    return(
        <div className="notifications">
            <h1>Notifications.</h1>
            {notifications && notifications.length>0 ? (
                <div className="notification-items">
                    {notifications.map((notification)=>(
                        <div className={`notification ${notification.isRead ? "read" : ""}`} key={notification._id}>
                            <label>{formatDate(notification.createdAt)}</label>
                            <p>{notification.message}</p>
                            {!notification.isRead && (
                                <a onClick={()=>readNotification(notification._id)}>Read</a>
                            )}
                        </div>
                    ))}
                </div>
            ):(
                <p>No notifications</p>
            )}
        </div>
    )
}