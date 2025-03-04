/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import { BorndayItem } from "../../../components/borndayItem/BorndayItem";
import { ConfirmPopup } from "../../../components/confirmPopup/ConfirmPopup";
import { CalendarComponent } from "../../../components/calendarComponent/CalendarComponent";
import { Button } from "../../../components/buttons/button/Button";
import { useBorndays } from "../../../hooks/useBorndays";

export function Calendar() {
    const navigate=useNavigate();

    const { borndays, fetchBorndays, setBorndays, deleteBornday }=useBorndays();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [openButtons, setOpenButtons]=useState<{ [key: string]: boolean }>({});
    const [borndayId, setBorndayId]=useState("");
    const [showConfirm, setShowConfirm]=useState(false);

    useEffect(()=>{
        fetchBorndays();
    }, [borndayId]);

    function changeMonth(offset: number) {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    }

    function daysInMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getBorndaysForDate(date: string) {
        return borndays.filter(b => {
            const borndayDate = new Date(b.date);
            return date.endsWith(`-${String(borndayDate.getDate()).padStart(2, "0")}`) && 
                date.includes(`-${String(borndayDate.getMonth() + 1).padStart(2, "0")}-`);
        });
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(year, month);

    function addBornday(date: string){
        navigate("/dashboard/add", { state: { date } });
    }

    function toggleOpen(e: React.MouseEvent, id: string){
        e.stopPropagation();
        setOpenButtons((prev)=>({
            [id]: !prev[id]
        }));
    };

    function toBornday(e: React.FormEvent, borndayId: string){
        e.preventDefault();
        navigate(`/dashboard/bornday/${borndayId}`);
    }

    function updateBornday(e: React.MouseEvent, borndayId: string){
        e.stopPropagation();
        navigate(`/dashboard/update/${borndayId}`);
    };

    function onSetBorndayId(e: React.MouseEvent, borndayId: string){
        e.stopPropagation();
        setBorndayId(borndayId);
    }

    async function handleDelete(e: React.FormEvent, borndayId: string){
        e.stopPropagation();
        e.preventDefault();

        setShowConfirm(false);
        await deleteBornday(borndayId, (borndayId)=>{
            setBorndays((prev)=>prev.filter((bornday)=>bornday._id!==borndayId));
        })
    };

    function onSetConfirm(e: React.MouseEvent, borndayId: string){
        e.stopPropagation();
        setShowConfirm(true);
        setBorndayId(borndayId);
    }

    return (
        <div className={`calendar ${showConfirm ? "blur" : ""}`}>
            <h1>Calendar</h1>
            <div className="calendar-details">
                <CalendarComponent
                    year={year}
                    firstDay={firstDay}
                    totalDays={totalDays}
                    month={month}
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onChangeMonth={changeMonth}
                    onSetSelectedDate={setSelectedDate}
                    getBorndaysForDate={getBorndaysForDate}
                />

                {selectedDate && (
                    <div className="calendar-bornday-details">
                        <div className="calendar-bornday-header">
                            <h3>{selectedDate}</h3>
                            <Button type="button" text="Add" functionName={()=>addBornday(selectedDate)} imageUrl="/add.png" imageClassName="add-icon"/>
                        </div>
                        <div className="calendar-bornday-items">
                        {getBorndaysForDate(selectedDate).map(bornday=>(
                            <BorndayItem
                                key={bornday._id}
                                bornday={bornday}
                                open={openButtons[bornday._id] || false}
                                onView={toBornday}
                                onEdit={updateBornday}
                                onSetId={onSetBorndayId}
                                onToggle={toggleOpen}
                                onSetConfirm={onSetConfirm}
                            />
                        ))}
                        </div>
                    </div>
                )}
            </div>
            {showConfirm && (
                <ConfirmPopup
                    text={`Are you sure to delete bornday of ${borndays.find(bornday=>bornday._id===borndayId)?.name}`}
                    onYes={(e)=>handleDelete(e, borndayId)} onNo={()=>setShowConfirm(false)}
                />
            )}
        </div>
    );
}