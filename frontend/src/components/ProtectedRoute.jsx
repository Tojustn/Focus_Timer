import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN,ACCESS_TOKEN } from "../constants"
import {useState, useEffect} from "react"
// ProtectedRoute acts as a wrapper for the "children"
// <ProtectedRoute><children> </ProtectedRoute>
function ProtectedRoute({children}){
    const [isAuthorized, setIsAuthorized] = useState(null)

    // Re renders a=to check if auth has an error catch() to get it
    useEffect(()=>{
        auth().catch(()=> setIsAuthorized(false))
    })
    /*
    async means it can use the await keyword to pause untilse await is over
    */
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            // Refreshing refresh url
            const res = await api.post("/api/token/refresh/",{
                refresh: refreshToken
            });
            // if the res suceeded
            if (res.status === 200){
                // Give access token
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                // Authorized is true
                setIsAuthorized(true)
            }
            else{
                setIsAuthorized(false)
                }
            
        }
        // Unless error
        catch(error){
            console.log(error)
            setIsAuthorized(false)
        }
    }
    const auth = async () => {

        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token){
            setIsAuthorized(false)
        }
        const decoded = jwtDecode(token)
        // Gets the expiration date
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        // if the token has expired, wait for refresh
        if(tokenExpiration < now){
            await refreshToken()
        } else{
            setIsAuthorized(true)
        }
    }
    if (isAuthorized==null){
        return <div>Loading...</div>
    }

    // If authorized is true, lets into children jsx else go into login page
    return isAuthorized ? children : <Navigate to="/login"></Navigate>
}

export default ProtectedRoute