import {useState, useEffect} from "react"
import createTimer from "./DetailSession";
import api from "../api"
function CurrentTimer({session,timer, onTimerEnd}){
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    
    const endTimer = () => {
        setIsActive(false);
        updateTimer(session.id,timer.id, { is_finished: true,  duration:  time/1000});
        onTimerEnd(timer)
        setTime(0)
    };
    
    const toggleTimer = () => {
        setIsActive(!isActive);
    }
    const updateTimer = (ses_id,id, updates) => {
        api
            .put(`/api/sessions/${ses_id}/timers/${id}`, updates) // Use put to send updates
            .then(response => {
                if (response.status === 200) {
                    console.log("Timer updated!");
                } else {
                    console.error("Failed to update timer");
                }
            })
            .catch(error => console.error("Error updating timer:", error));
    };
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1); // Increase time every millisecond
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval); // Cleanup on unmount
    }, [isActive, time]);

    const formatTime = time => {
        const hours = Math.floor(time / 3600000); // 3600000 milliseconds in an hour
        const minutes = Math.floor((time % 3600000) / 60000); // 60000 milliseconds in a minute
        const seconds = Math.floor((time % 60000) / 1000); // 1000 milliseconds in a second
        const milliseconds = time % 1000; // Remaining milliseconds
    
        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}.${milliseconds < 100 ? `0${milliseconds}` : milliseconds}`;
    };
    
    return(
        <>
            {timer.is_break ? (
                <>
                <div className="current-timer-container-study">
                    <p className="current-timer-title">Break</p>
                    <div className="timer">
                        <h1>{formatTime(time)}</h1>
                        <button onClick={toggleTimer}>
                        {isActive ? "Pause" : "Start"}
                        </button>
                        <button onClick={endTimer}>Study</button>
                    </div>
                </div>
                
            </>
            ) : (
                <>
                    <div className="current-timer-container-study">
                        <p className="current-timer-title">Study</p>
                        <div className="timer">
                            <h1>{formatTime(time)}</h1>
                            <button onClick={toggleTimer}>
                            {isActive ? "Pause" : "Start"}
                            </button>
                            <button onClick={endTimer}>Break</button>
                        </div>
                    </div>
                    
                </>
            )}
            
        </>
        
    
    );
}
export default CurrentTimer