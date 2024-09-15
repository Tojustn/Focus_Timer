import Form from "../components/Form"
import "../styles/Register.css";
import {useState} from "react"
function Register(){
    const [isActive, setIsActive] = useState(false)
    const LearnMore = () =>{
        setIsActive(!isActive)
    }
    return (<div className = "register-container">
    <div className = "register-form">
    <Form route = "/api/user/register/" method = "register"/>
    </div>
    <div className ="learn-more-container">
        <p className = {`hidden-register-text ${isActive ? 'active': ''}`}>This Focus Timer is meant to help make your study/work sessions more effective
            whenever you feel mentally fatigued just take a break. It also tracks your study percentage
        </p>
        <button className = "learn-more" onClick = {LearnMore}>
            {isActive ? "Show Less": "Show More"}
        </button>
        </div>
    </div>
    );

}

export default Register