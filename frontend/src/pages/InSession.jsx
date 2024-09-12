import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the import based on your project structure
import DetailSession from '../components/DetailSession';
function InSession() {
    const { id } = useParams(); // Retrieve session ID from URL parameters
    const [session, setSession] = useState(null); // Initialize session state
    const [error, setError] = useState(null); // Initialize error state
    const navigate = useNavigate();
    useEffect(() => {
        // Define function to fetch session data
        getSession();
        
    }, [id]); // Dependency array ensures effect runs when ID changes
    useEffect(() =>{
        if (session && session.is_finished){
            navigate("/")
            alert("This session has ended or doesn't exist")
        }
    }, [session])

    const getSession = () => {
        console.log("Fetching session with ID:", id); // Check the ID being used
        api.get(`/api/sessions/${id}`)
        .then((res) => {
            setSession(res.data);
        })
        .catch((err) => {
            console.error("Error fetching session:", err); // Use console.error for errors
            setError(err);
        });
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <DetailSession session = {session} />
    );
}

export default InSession;
