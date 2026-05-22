import React, {useContext, useState} from 'react';
import { useAuth } from "../hooks/useAuth.jsx";
import '../stylesheets/Login.css'
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {loginUser} = useAuth()
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        const result = await loginUser(email, password)
        if (!result.success) {
            setError(result.error || 'Invalid email or password')
            return null
        }
        navigate('/')
    }

    return (
        <div className={'loginPage'}>
            <div className={'loginContainer'}>
                <h2>LOGIN</h2>
                <form onSubmit={handleSubmitLogin} autoComplete={'off'} className={'loginForm'}>
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
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </form>
                <p>Don't have an account? <Link to={'/signup'}>Sign Up</Link></p>
                <p>Go back <Link to={'/'}>HOME</Link></p>
            </div>
        </div>
    )
}

export default Login