import Form from "../components/Form"
import "../styles/Login.css"

import { useNavigate } from "react-router-dom"
function Login(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/register");
    }
    return (
    <>
    <Form route = "api/token/" method = "login"/>
    <div className = "register-link">
        <p className = 'no-account'>Don't have an account?</p>
        <button onClick = {handleClick} className = 'register-link-button'> Register here </button>
    </div>
    </>
    );
}

export default Login 