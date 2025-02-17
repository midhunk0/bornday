import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/auth/login/Login";
import { Register } from "./pages/auth/register/Register";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Add } from "./pages/dashboard/add/Add";
import { Calendar } from "./pages/dashboard/calendar/Calendar";
import { Bornday } from "./pages/dashboard/bornday/Bornday";
import { Borndays } from "./pages/dashboard/borndays/Borndays";
import { Account } from "./pages/dashboard/account/Account";
import { Update } from "./pages/dashboard/update/Update";
import { Verification } from "./pages/auth/verification/Verification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./PrivateRoute";

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/verify" element={<Verification/>}/>
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard/>
                    </PrivateRoute>
                }>
                    <Route path="" element={<Add/>}/>
                    <Route path="add" element={<Add/>}/>
                    <Route path="calendar" element={<Calendar/>}/>
                    <Route path="bornday/:borndayId" element={<Bornday/>}/>
                    <Route path="borndays" element={<Borndays/>}/>
                    <Route path="account" element={<Account/>}/>
                    <Route path="update/:borndayId" element={<Update/>}/>
                </Route>
            </Routes>
            <ToastContainer 
                toastStyle={{
                    borderRadius: "16px",
                }}
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={true} 
                newestOnTop={false} 
                closeOnClick={true} 
                rtl={false}
                pauseOnFocusLoss={true} 
                draggable={true} 
                theme="colored"
                pauseOnHover={true}
                closeButton={false}
            />
        </Router>
    )
};

export default App;