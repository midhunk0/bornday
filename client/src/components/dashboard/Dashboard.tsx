import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import "./Dashboard.css";

export function Dashboard(){
    return(
        <div className="dashboard">
            <Sidebar/>
            <div className="dashboard-content">
                <Outlet/>
            </div>
        </div>
    )
};
