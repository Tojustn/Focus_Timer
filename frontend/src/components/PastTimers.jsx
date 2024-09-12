import React from "react"
import '../styles/Timer.css'
function PastTimers ({timer}){
    return (
        <>
            {timer.is_break ? (
                <>
                    <div className="timer-container-break">
                    <p className="timer-title">Break</p>
                    <p className="timer-duration">{timer.duration}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="timer-container-study">
                    <p className="timer-title">Work</p>
                    <p className="timer-duration">{timer.duration}</p>

                    </div>
                </>
            )}
        </>
    );
}
        

    
        

export default PastTimers