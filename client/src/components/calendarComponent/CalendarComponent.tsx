import "./CalendarComponent.css";

interface Bornday{
    _id: string;
    name: string;
    date: string;
    imageUrl: string;
}

interface CalendarProps{
    year: number;
    firstDay: number;
    totalDays: number;
    month: number;
    currentDate: Date;
    selectedDate: string;
    onChangeMonth: (i: number)=>void;
    onSetSelectedDate: (date: string)=>void;
    getBorndaysForDate: (date: string)=>Bornday[];
}

export function CalendarComponent({ year, firstDay, totalDays, month, currentDate, selectedDate, onChangeMonth, onSetSelectedDate, getBorndaysForDate }: CalendarProps){
    
    return(
        <>
            <div className="calendarComponent-header">
                <div onClick={()=>onChangeMonth(-1)} className="calendarComponent-header-icon-wrapper">
                    <img src="/left.png" alt="img" className="calendarComponent-left-icon"/>
                </div>
                <h2>{currentDate.toLocaleString("default", { month: "long" })} {year}</h2>
                <div onClick={()=>onChangeMonth(1)} className="calendarComponent-header-icon-wrapper">
                    <img src="/right.png" alt="img" className="calendarComponent-right-icon"/>
                </div>
            </div>
            <hr/>
            <div className="calendarComponent-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day=>(
                    <div key={day} className="calendarComponent-day-header">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, idx)=>(
                    <div key={"empty-" + idx} className="calendarComponent-empty"></div>
                ))}
                {Array.from({ length: totalDays }, (_, day)=>{
                    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
                    const borndaysOnDate = getBorndaysForDate(date);
                    return (
                        <div
                            key={date}
                            className={`calendarComponent-day ${borndaysOnDate.length > 0 ? "has-bornday" : ""} ${selectedDate === date ? "selected" : ""}`}
                            onClick={() => onSetSelectedDate(date)}
                        >
                            {day + 1}
                        </div>
                    );
                })}
            </div>
        </>
    )
}