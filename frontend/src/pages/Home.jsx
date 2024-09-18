import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import Session from "../components/Session"
import LineGraph from '../components/Line';
import "../styles/Home.css"

function Home(){
    const [sessions, setSessions] = useState([]);
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [user, setUser] = useState("")
    const navigate = useNavigate()

    useEffect(() =>{
        getSessions();
        
        // Get sessions is called only once due to empty dependency []
    }, [])
    const getSessions = () => {
        // Sends a get requests to my list view, getting the list objects
        api.get("/api/sessions/")
        .then((res) => res.data)
        .then((data) => setSessions(data))
        .catch((err) => alert(err));
    };
    const deleteSession = (id) => {
        api
            .delete(`/api/sessions/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Session deleted!");
                else alert("Failed to delete Session.");
                getSessions();
            })
            .catch((error) => alert(error));
    };
    
    const createSession = async (e) => {
        e.preventDefault()
        // Sends a post request to my listcreate view, making a new object with the title and description
        await api
            .post("/api/sessions/", {title, description})
            .then((res) => {
                if (res.status === 201){

                alert ("Session created!")
                // Makes a newSession with the Session data that will be used to navigate
                const newSession = res.data
                console.log("Navigating to:", `/sessions/${newSession.id}`);

                navigate(`/sessions/${newSession.id}`)
                }
                else alert("Failed to make session");
                getSessions();
            })
            .catch((err) => alert(err + "\n"))
       
    };
    return <div className = "home-container">
            <div className="past-sessions-container">
                <h2 className = "past-sessions">Past Sessions</h2>
                {sessions
                    .filter(session => session.is_finished) // Filter out finished sessions
                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                    .slice(0,5) // Sort by start_date in descending order
                    .map(session => (
                        
                        <Session session={session} onDelete={deleteSession} key={session.id} />
                ))}
            </div>
                <form className = "former-container" onSubmit = {createSession}>
                    <h2>Start Session⏱️</h2>
                    <label htmlFor = "title"> Title:</label>
                    <br/>
                    <input type = "text" 
                    id="title" 
                    name="title" 
                    required 
                    onChange = {(e) => setTitle(e.target.value)}
                    value = {title}>
                    </input>
                    <br/>
                    <label htmlFor="description">Description:</label>
                <br/>
                <textarea
                    id="description"
                    name="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <br />
                    <input type = "submit" value = "Start Session"></input>
                </form>
                <div className = "chart-container">
                <LineGraph></LineGraph>
                </div>
        </div>
}

export default Home