import {useState} from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css/"
import LoadingIndicator from "./LoadingIndicator"
// Route is the route that it takes after, method either login or register
function Form({route,method}){
    // UseState(hook) makes a stateful variable and set command
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register" 
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try{
            const res = await api.post(route,{username,password})
            if(method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } 
            // If it wasn't login the only other one is register
            // Take new registered user to the login page
            else{
                navigate("/login")
            }
            
        }
        catch(error){
            alert("Error occured, try logging in with the correct username and password")
        }
        finally{
            setLoading(false)
        }
    }
    return(
        // value will always reflect username const
        // Whenever the text is changed we are setting the username equal to e.target.value (aka the text in the field)
        <form onSubmit={handleSubmit} className = "form-container">
            <h1> {name} </h1>
            <input className="form-input" 
            type = "text" 
            value = {username}
            onChange={(e) => setUsername(e.target.value)} 
            placeholder = "Username"
            />
            <input className="form-input" 
            type = "password" 
            value = {password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder = "Password"
            />
            {loading && <LoadingIndicator></LoadingIndicator>}
            <button className = "form-button" type = "submit">{name}</button>
        </form>
    );
}

export default Form