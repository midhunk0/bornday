import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/auth/login/Login";
import { Register } from "./components/auth/register/Register";
import { Dashboard } from "./components/dashboard/Dashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </Router>
    )
}

export default App
