import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/DetailSession.css";
import PastTimers from "./PastTimers";
import CurrentTimer from "./CurrentTimer";

function DetailSession({ session }) {
    const [timers, setTimers] = useState([]);
    const [mostRecentTimer, setMostRecentTimer] = useState(null);
    const [isBreak, setIsBreak] = useState(false);
    const navigate = useNavigate();

    // Function to fetch timers
    const getTimers = async () => {
        try {
            const response = await api.get(`/api/sessions/${session.id}/timers`);
            setTimers(response.data);
        } catch (error) {
            console.error('Error fetching timers:', error);
            alert('Failed to fetch timers');
        }
    };

    useEffect(() => {
        getTimers(); // Fetch timers when component mounts
    }, [mostRecentTimer]); // Add dependency on timers

    // Function to create a new timer
    const createTimer = async (e, isBreak) => {
        if (e) e.preventDefault();
        try {
            const response = await api.post(`/api/sessions/${session.id}/timers/`, { is_break: isBreak });
            setMostRecentTimer(response.data);
            setIsBreak(!isBreak);
            await getTimers(); // Fetch the updated list of timers
        } catch (error) {
            console.error('Error creating timer:', error);
            alert('Failed to create timer');
        }
    };

    // Function to end the timer and create a new one
    const handleTimerEnd = async () => {
        try {
            await createTimer(null, isBreak); // Create a new timer
        } catch (error) {
            console.error('Error ending timer:', error);
            alert('Failed to end timer');
        }
    };

    // Function to update session
    const updateSession = async (ses_id, updates) => {
        try {
            const response = await api.put(`/api/sessions/${ses_id}/`, updates);
            if (response.status === 200) {
                console.log("Session updated!");
            } else {
                throw new Error("Failed to update session");
            }
        } catch (error) {
            console.error("Error updating session:", error);
            throw error;
        }
    };

    // Handle end session button click
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await updateSession(session.id, {
                title: session.title,
                is_finished: true,
            });
            navigate("/");
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const mostRecentPastTimer = timers
        .filter(timer => timer.is_finished)
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))[0];

    return (
        <div className = "detail-session-container">
            <div className = "title-container">
                <h2>{session.title}</h2>
                <p>{session.description}</p>
            </div>
            <div className="end-session-container">
                <input type="submit" value="End Session" className = "end-session" onClick = {handleClick}/>
            </div>
            <div className="past-timer-container">
                <h2 className="past-timers">Most Recent Timer</h2>
                {mostRecentPastTimer ? (
                    <PastTimers timer={mostRecentPastTimer} />
                ) : (
                    <p>No past timers available</p>
                )}
            </div>
            <div className="current-timer">
                <br />
                {mostRecentTimer === null ? (
                    <form onSubmit={(e) => createTimer(e, isBreak)} className="start-timer">
                        <h2>Start Timer</h2>
                        <input type="submit" value="Start Timer" />
                    </form>
                ) : (
                    <CurrentTimer session={session} timer={mostRecentTimer} onTimerEnd={handleTimerEnd} />
                )}
            </div>
        </div>
    );
}

export default DetailSession;
