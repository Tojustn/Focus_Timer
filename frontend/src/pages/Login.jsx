import Form from "../components/Form"
import "../styles/Login.css"
import manstudying from '../assets/static/images/manstudying.jpg';
import manstudyingcoffee from '../assets/static/images/manstudyingcoffee.png'

import { useNavigate } from "react-router-dom"
function Login(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/register");
    }
    return (
    <div className = 'all-login-container'>
        <div className = 'welcome-container'>
            <h1>Ready to work more efficiently?</h1>
        </div>
        <div className = 'login-container'>
        <div className = "welcome-text">
            
        </div>
        <img className = "study-image" src={manstudying}></img>
        <div className = 'login-form'>
        <Form route = "api/token/" method = "login"/>
        </div>
        <img className = "study-image-coffee" src={manstudyingcoffee}></img>
        
        </div>
        <div className = "register-link">
            <p className = 'no-account'>Don't have an account?</p>
            <button onClick = {handleClick} className = 'register-link-button'> Register here </button>
        </div>
    </div>
    );
}

export default Login 