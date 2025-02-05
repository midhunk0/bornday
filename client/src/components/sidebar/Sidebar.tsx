import { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export function Sidebar(){
    const [collapsed, setCollapsed]=useState(false);

    const navigate=useNavigate();

    function handleCollapsed(){
        setCollapsed(!collapsed);
    }

    return(
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                {!collapsed && <h2 onClick={()=>navigate("/dashboard")}>bornday.</h2>}
                <button className="sidebar-button" onClick={handleCollapsed}>
                    <img src="/cake.png" alt="img"/>
                </button>
            </div>
            <div className="sidebar-menus">
                <div className="sidebar-menu" onClick={()=>navigate("/dashboard/add")}>
                    <img src="/add.png" alt="img"/>
                    {!collapsed && <a>Add Bornday</a>}
                </div>
                <div className="sidebar-menu" onClick={()=>navigate("/dashboard/calendar")}>
                    <img src="/month.png" alt="img"/>
                    {!collapsed && <a>Calendar View</a>}
                </div>
                <div className="sidebar-menu" onClick={()=>navigate("/dashboard/borndays")}>
                    <img src="/bornday.png" alt="img"/>
                    {!collapsed && <a>All Borndays</a>}
                </div>
                <div className="sidebar-menu" onClick={()=>navigate("/dashboard/bornday/:id")}>
                    <img src="/day.png" alt="img"/>
                    {!collapsed && <a>Day View</a>}
                </div>
            </div>
            <div className="sidebar-footer">
                <div className="sidebar-menu" onClick={()=>navigate("/dashboard/account")}>
                    <img src="/option.png" alt="img"/>
                    {!collapsed && <a>Account</a>}
                </div>
            </div>
        </div>
    )
}