import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import DetailSession from '../components/DetailSession';

function InSession() {
    const { id } = useParams(); // Retrieve session ID from URL parameters
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (id) {
            console.log(id)
            getSession(id);
        } else {
            setError(new Error("No session ID provided"));
        }
    }, [id]);

    useEffect(() => {
        if (session && session.is_finished) {
            navigate("/");
            alert("This session has ended or doesn't exist");
        }
    }, [session, navigate]);

    const getSession = (sessionId) => {
        console.log("Fetching session with ID:", sessionId);
        api.get(`/api/sessions/${sessionId}`)
            .then((res) => {
                setSession(res.data);
            })
            .catch((err) => {
                console.error("Error fetching session:", err);
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
        <DetailSession session={session} />
    );
}

export default InSession;