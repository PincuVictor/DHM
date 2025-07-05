import React, {useContext, useState} from 'react';
import AuthContext from "../components/AuthContext.jsx";
import '../stylesheets/Login.css'
import {Link, useNavigate} from "react-router";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {loginUser} = useContext(AuthContext)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        const success = await loginUser(email, password)
        if (!success) {
            setError('Invalid email or password')
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