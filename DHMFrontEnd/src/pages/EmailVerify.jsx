import {Link, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const API_VERIFY_EMAIL = import.meta.env.VITE_API_VERIFY_EMAIL;

export default function EmailVerify() {
    const {uidb64, token} = useParams()
    const [message, setMessage] = useState("Verifying...")
    const [success, setSuccess] = useState(null)
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true
        axios
            .get(`${API_VERIFY_EMAIL}${uidb64}/${token}/`)
            .then(() => {
                setSuccess(true)
                setMessage("Email verified successfully! You can now log in.")
            })
            .catch(() => {
                setSuccess(false)
                setMessage("Invalid or expired verification link.")
            });
    }, [uidb64, token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen Oxanium">
            <h1 className="text-4xl font-bold mb-4">DHM</h1>
            <h2 className={`text-2xl font-bold mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>
                {message}
            </h2>
            <Link to="/">Go back to home</Link>
        </div>
    );
}
