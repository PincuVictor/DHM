import React, {useContext, useState} from 'react';
import { useAuth } from "../hooks/useAuth.jsx";
import '../stylesheets/Signup.css'
import {Link} from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const {signupUser, verifyUser} = useAuth()
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [success, setSuccess] = useState(false)
    const [needsVerification, setNeedsVerification] = useState(false)

    const handleSubmitSignup = async (e) => {
        e.preventDefault()
        if (password !== password2) {
            setError(true);
            setErrorMsg("Passwords do not match.");
            return;
        }

        const result = await signupUser(email, password, password2, firstName, lastName);

        if (result.success) {
            setNeedsVerification(true)
            setSuccess(true)
            setError(false)
        } else {
            setError(true)
            setErrorMsg(result.error || "Signup failed. Please check your input or try again.");
        }
    }

    const handleVerifySubmit = async (e) => {
        e.preventDefault()
        const result = await verifyUser(email, verificationCode);
        
        if (result.success) {
            window.location.href = '/' // redirect to home on success
        } else {
            setError(true)
            setErrorMsg(result.error || "Verification failed.");
        }
    }

    return (
        <div className={'signupPage'}>
            <div className={'signupContainer'}>
                <h2>{needsVerification ? "VERIFY EMAIL" : "SIGN UP"}</h2>
                
                {!needsVerification ? (
                    <form onSubmit={handleSubmitSignup} autoComplete={'off'} className={'signupForm'}>
                        <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <input id="password2" type="password" placeholder="Confirm Password" value={password2} onChange={e => setPassword2(e.target.value)} required />
                        <input id="firstName" type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        <input id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        <button type="submit">SUBMIT</button>
                        {error && <p style={{color: 'red'}}>{errorMsg}</p>}
                    </form>
                ) : (
                    <form onSubmit={handleVerifySubmit} autoComplete={'off'} className={'signupForm'}>
                        <p style={{color: '#fff', marginBottom: '15px'}}>Please enter the 6-digit code sent to your email.</p>
                        <input 
                            id="verificationCode" 
                            type="text" 
                            placeholder="6-digit code" 
                            value={verificationCode} 
                            onChange={e => setVerificationCode(e.target.value)} 
                            required 
                            maxLength={6}
                        />
                        <button type="submit">VERIFY</button>
                        {error && <p style={{color: 'red'}}>{errorMsg}</p>}
                    </form>
                )}

                {!needsVerification && <p>Already have an account? <Link to={'/login'}>Login</Link></p>}
                <p>Go back <Link to={'/'}>HOME</Link></p>
            </div>
        </div>
    )
}

export default Signup