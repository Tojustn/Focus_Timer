import React from "react"
import "../styles/Session.css"
function Session ({session,onDelete}){
    const formattedDate = new Date(session.start_date).toLocaleDateString("en-US")
    return(
        <div className="session-container">
            <p className = "session-title">{session.title}</p>
            <p className = "session-date">{formattedDate}</p>
            <p className = "session-duration">{session.duration}</p>
            <button className="delete-button" onClick = {() => onDelete(session.id)}>Delete Session</button>

        </div>
        
    );

}

export default Session