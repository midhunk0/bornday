import { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotification } from "../../context/notificationContext";

interface SidebarMenuProps{
    className?: string;
    dest: string;
    imageUrl: string;
    imageClassName: string;
    text: string;
}

export function Sidebar(){
    const [collapsed, setCollapsed]=useState(false);
    const [show, setShow]=useState(true);
    const navigate=useNavigate();
    const location=useLocation();
    const { notificationsCount }=useNotification();

    useEffect(()=>{
        const handleResize=()=>{
            if(window.innerWidth<=720){
                setShow(false);
                setCollapsed(false);
            }
            else{
                setShow(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);

    const toggle=()=>{
        if(window.innerWidth<=720){
            setCollapsed(false);
            setShow((prev)=>!prev);
        } 
        else{
            setShow(true);
            setCollapsed((prev)=>!prev);
        }
    };

    const handleMenu=(path: string)=>{
        navigate(path);
        if(window.innerWidth<=720){
            setShow(false);
        }
    };

    function SidebarMenu({ className="", dest, imageUrl, imageClassName, text }: SidebarMenuProps){
        const isActive=location.pathname===dest;
        return(
            <div className={`sidebar-menu ${className} ${isActive ? "active" : ""}`} onClick={()=>handleMenu(dest)}>
                <img src={imageUrl} alt="image" className={imageClassName} />
                {text==="Notifications" && notificationsCount>0 && <label>{notificationsCount}</label>}
                {!collapsed && <a>{text}</a>}
            </div>
        )
    }

    return(
        <>
            {window.innerWidth<=720 && !show && (
                <div className="sidebar-toggle" onClick={toggle}>
                    <img src="/cake.png" alt="img"/>
                </div>
            )}
            <div className={`sidebar ${collapsed ? "collapsed" : ""} ${!show ? "hidden" : ""}`}>
                <div className="sidebar-header">
                    {!collapsed && <h1 onClick={()=>handleMenu("/dashboard")}>bornday.</h1>}
                    <img src="/cake.png" alt="Toggle" onClick={toggle}/>
                </div>
                <div className="sidebar-menus">
                    <SidebarMenu dest="/dashboard/add" imageUrl="/add.png" imageClassName="sidebar-icon-add" text="Add Bornday" />
                    <SidebarMenu dest="/dashboard/calendar" imageUrl="/month.png" imageClassName="sidebar-icon-month" text="Calendar View"/>
                    <SidebarMenu dest="/dashboard/borndays" imageUrl="/bornday.png" imageClassName="sidebar-icon-bornday" text="All Borndays"/>
                    <SidebarMenu dest="/dashboard/notifications" imageUrl="/notifications.png" imageClassName="sidebar-icon-notifications" text="Notifications"/>
                    <SidebarMenu className="footer" dest="/dashboard/account" imageUrl="/option.png" imageClassName="sidebar-icon-option" text="Account"/>
                </div>
            </div>
        </>
    );
}
