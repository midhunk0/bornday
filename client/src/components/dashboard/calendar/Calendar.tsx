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

    const [openButtons, setOpenButtons]=useState<{ [key: string]: boolean }>({});


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


    function formatDate(dateString: string){
        const date=new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    function toggleOpen(e: React.MouseEvent, id: string){
        e.stopPropagation();
        setOpenButtons((prev)=>({
            ...prev,
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

    async function deleteBornday(e: React.FormEvent, borndayId: string){
        e.stopPropagation();
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/deleteBornday/${borndayId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setBorndays((prevBorndays) => prevBorndays.filter(bornday => bornday._id !== borndayId));
            }
            console.log(result.message);
        }
        catch(error){
            if(error instanceof Error){
                console.log("Error while deleting bornday: ", error.message);
            }
            else{
                console.log("An unknown error occurred");
            }
        }
    }


    return (
        <div className="calendar">
            <h1>Calendar</h1>
            <div className="calendar-details">
                <div className="calendar-header">
                    <div onClick={()=>changeMonth(-1)} className="calendar-button">
                        <img src="/left.png" alt="img" className="calendar-icon-left"/>
                    </div>
                    <h2>{currentDate.toLocaleString("default", { month: "long" })} {year}</h2>
                    <div onClick={()=>changeMonth(1)} className="calendar-button">
                        <img src="/right.png" alt="img" className="calendar-icon-right"/>
                    </div>
                </div>
                <hr/>
                <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day=>(
                        <div key={day} className="calendar-day-header">{day}</div>
                    ))}

                    {Array.from({ length: firstDay }).map((_, idx)=>(
                        <div key={"empty-" + idx} className="calendar-empty"></div>
                    ))}

                    {Array.from({ length: totalDays }, (_, day)=>{
                        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
                        const borndaysOnDate = getBorndaysForDate(date);

                        return (
                            <div
                                key={date}
                                className={`calendar-day ${borndaysOnDate.length > 0 ? "has-bornday" : ""} ${selectedDate === date ? "selected" : ""}`}
                                onClick={() => setSelectedDate(date)}
                            >
                                {day + 1}
                            </div>
                        );
                    })}
                </div>

            {selectedDate && (
                <div className="calendar-bornday-details">
                    <div className="calendar-bornday-header">
                        <h3>{selectedDate}</h3>
                        <button onClick={()=>addBornday(selectedDate)} className="calendar-add">
                            Add
                            <div className="calendar-icon-wrapper">
                                <img src="/add.png" alt="img" className="calendar-icon"/>
                            </div>
                        </button>
                    </div>
                    <div className="calendar-bornday-items">
                    {getBorndaysForDate(selectedDate).map(bornday=>(
                        <div className="calendar-borndays-item" key={bornday._id} onClick={(e)=>toBornday(e, bornday._id)}>
                            <div className="calendar-borndays-item-content">
                                <p>{bornday.name}</p>
                                <p>{formatDate(bornday.date)}</p>
                            </div>
                            <div className="calendar-borndays-buttons">
                                {openButtons[bornday._id] && (
                                    <div className="calendar-borndays-icon-wrapper" onClick={(e)=>updateBornday(e, bornday._id)}>
                                        <img src="/edit.png" alt="img" className="calendar-borndays-icon-edit"/>
                                    </div>
                                )}
                                {openButtons[bornday._id] && (
                                    <div className="calendar-borndays-icon-wrapper" onClick={(e)=>deleteBornday(e, bornday._id)}>
                                        <img src="/delete.png" alt="img" className="calendar-borndays-icon-delete"/>
                                    </div>
                                )}
                                <div className="calendar-borndays-icon-wrapper">
                                    <img src={openButtons[bornday._id] ? "/right.png" : "/left.png"} alt="img" className={openButtons[bornday._id] ? "calendar-borndays-icon-right" : "calendar-borndays-icon-left"} onClick={(e)=>toggleOpen(e, bornday._id)}/>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}