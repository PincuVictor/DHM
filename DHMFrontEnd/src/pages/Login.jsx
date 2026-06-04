import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth.jsx";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundAnimation from "../components/BackgroundAnimation.jsx";
import '../stylesheets/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const result = await loginUser(email, password);
        if (!result.success) {
            setError(result.error || 'Invalid email or password');
            return null;
        }
        navigate('/');
    };

    return (
        <div className="loginPage">
            <BackgroundAnimation />
            
            <motion.div 
                className="loginContainer"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h2>LOGIN</h2>
                <form onSubmit={handleSubmitLogin} autoComplete="off" className="loginForm">
                    {error && <div className="error-text">{error}</div>}
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">SUBMIT</button>
                </form>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                <p>Go back <Link to="/">HOME</Link></p>
            </motion.div>
        </div>
    );
}

export default Login;