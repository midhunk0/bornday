import { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
    const [collapsed, setCollapsed]=useState(false);
    const [show, setShow]=useState(true);
    const navigate=useNavigate();

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
        if (window.innerWidth <= 720) {
            setCollapsed(false);
            setShow((prev) => !prev);
        } else {
            setShow(true);
            setCollapsed((prev) => !prev);
        }
    };

    const handleMenu=(path: string)=>{
        navigate(path);
        if(window.innerWidth<=720){
            setShow(false);
        }
    };

    return (
        <>
            {window.innerWidth <= 720 && !show && (
                <div className="sidebar-toggle" onClick={toggle}>
                    <img src="/cake.png" alt="img"/>
                </div>
            )}
            <div className={`sidebar ${collapsed ? "collapsed" : ""} ${show ? "show" : "hidden"}`}>
                <div className="sidebar-header">
                    {!collapsed && <h1 onClick={() => handleMenu("/dashboard")}>bornday.</h1>}
                    <img src="/cake.png" alt="Toggle" onClick={toggle} />
                </div>
                <div className="sidebar-menus">
                    <div className="sidebar-menu" onClick={() => handleMenu("/dashboard/add")}>
                        <img src="/add.png" alt="Add" className="sidebar-icon-add" />
                        {!collapsed && <a>Add Bornday</a>}
                    </div>
                    <div className="sidebar-menu" onClick={() => handleMenu("/dashboard/calendar")}>
                        <img src="/month.png" alt="Calendar" className="sidebar-icon-month" />
                        {!collapsed && <a>Calendar View</a>}
                    </div>
                    <div className="sidebar-menu" onClick={() => handleMenu("/dashboard/borndays")}>
                        <img src="/bornday.png" alt="Bornday" className="sidebar-icon-bornday" />
                        {!collapsed && <a>All Borndays</a>}
                    </div>
                </div>
                <div className="sidebar-footer" onClick={() => handleMenu("/dashboard/account")}>
                    <img src="/option.png" alt="Account" className="sidebar-icon-option" />
                    {!collapsed && <a>Account</a>}
                </div>
            </div>
        </>
    );
}
