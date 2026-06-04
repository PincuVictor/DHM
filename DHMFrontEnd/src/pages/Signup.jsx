import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth.jsx";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundAnimation from "../components/BackgroundAnimation.jsx";
import '../stylesheets/Signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    
    const { signupUser, verifyUser } = useAuth();
    
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmitSignup = async (e) => {
        e.preventDefault();
        setError(false);
        
        if (password !== password2) {
            setError(true);
            setErrorMsg("Passwords do not match.");
            return;
        }

        const result = await signupUser(email, password, password2, firstName, lastName);

        if (result.success) {
            setNeedsVerification(true);
        } else {
            setError(true);
            setErrorMsg(result.error || "Signup failed. Please check your input or try again.");
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError(false);
        const result = await verifyUser(email, verificationCode);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(true);
            setErrorMsg(result.error || "Verification failed.");
        }
    };

    return (
        <div className="signupPage">
            <BackgroundAnimation />

            <motion.div 
                className="signupContainer"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h2>{needsVerification ? "VERIFY EMAIL" : "SIGN UP"}</h2>
                
                {error && <div className="error-text">{errorMsg}</div>}

                <AnimatePresence mode="wait">
                    {!needsVerification ? (
                        <motion.form 
                            key="signup"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSubmitSignup} 
                            autoComplete="off" 
                            className="signupForm"
                        >
                            <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                            <input id="firstName" type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                            <input id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                            <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                            <input id="password2" type="password" placeholder="Confirm Password" value={password2} onChange={e => setPassword2(e.target.value)} required />
                            
                            <button type="submit">SUBMIT</button>
                        </motion.form>
                    ) : (
                        <motion.form 
                            key="verify"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleVerifySubmit} 
                            autoComplete="off" 
                            className="signupForm"
                        >
                            <p style={{color: '#ccc', marginBottom: '1.5rem', textAlign: 'center'}}>
                                Please enter the 6-digit code sent to your email.
                            </p>
                            <input 
                                id="verificationCode" 
                                type="text" 
                                placeholder="6-digit code" 
                                value={verificationCode} 
                                onChange={e => setVerificationCode(e.target.value)} 
                                required 
                                maxLength={6}
                                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                            />
                            <button type="submit">VERIFY</button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {!needsVerification && <p>Already have an account? <Link to="/login">Login</Link></p>}
                <p>Go back <Link to="/">HOME</Link></p>
            </motion.div>
        </div>
    );
}

export default Signup;