import { useState, useEffect } from "react";
import "./Calendar.css";
import { useNavigate } from "react-router-dom";

interface Bornday {
    _id: string;
    name: string;
    date: string;
}

export function Calendar() {
    const [borndays, setBorndays] = useState<Bornday[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const environment = import.meta.env.MODE;
    const apiUrl = environment === "development"
        ? import.meta.env.VITE_APP_DEV_URL
        : import.meta.env.VITE_APP_PROD_URL;
    const navigate=useNavigate();

    useEffect(() => {
        async function fetchBorndays() {
            try {
                const response = await fetch(`${apiUrl}/fetchBorndays`, {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                if (response.ok) {
                    setBorndays(result.borndays);
                }
            } catch (error) {
                console.error("Error fetching borndays:", error);
            }
        }
        fetchBorndays();
    }, [apiUrl]);

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

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div onClick={() => changeMonth(-1)} className="calendar-button">
                    <img src="/left.png" alt="img" className="calendar-icon-left"/>
                </div>
                <h2>{currentDate.toLocaleString("default", { month: "long" })} {year}</h2>
                <div onClick={() => changeMonth(1)} className="calendar-button">
                    <img src="/right.png" alt="img" className="calendar-icon-right"/>
                </div>
            </div>

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}

                {Array.from({ length: firstDay }).map((_, idx) => (
                    <div key={"empty-" + idx} className="calendar-empty"></div>
                ))}

                {Array.from({ length: totalDays }, (_, day) => {
                    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
                    const borndaysOnDate = getBorndaysForDate(date);

                    return (
                        <div
                            key={date}
                            className={`calendar-day ${borndaysOnDate.length > 0 ? "has-bornday" : ""} ${selectedDate === date ? "selected" : ""}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            {day + 1}
                            {/* {borndaysOnDate.length > 0 && <span className="bornday-dot"></span>} */}
                        </div>
                    );
                })}
            </div>

            {selectedDate && (
                <div className="bornday-details">
                    <h3>Borndays on {selectedDate}:</h3>
                    {getBorndaysForDate(selectedDate).map(bornday => (
                        <div key={bornday._id} className="bornday-item">
                            <p>{bornday.name}</p>
                        </div>
                    ))}
                    <button onClick={()=>addBornday(selectedDate)} className="calendar-add">
                        Add bornday
                        <div className="calendar-icon-wrapper">
                            <img src="/add.png" alt="img" className="calendar-icon"/>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}