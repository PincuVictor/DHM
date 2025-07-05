import React, {useContext, useState} from 'react';
import AuthContext from "../components/AuthContext.jsx";
import '../stylesheets/Signup.css'
import {Link} from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const {signupUser} = useContext(AuthContext)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmitSignup = async (e) => {
        e.preventDefault()
        const result = await signupUser(email, password, password2, firstName, lastName);

        setSuccess(result);
        setError(!result);

        if (result) {
            setEmail('');
            setPassword('');
            setPassword2('');
            setFirstName('');
            setLastName('');
        }

        if (!result) {
            setErrorMsg("Signup failed. Please check your input or try again.");
            setError(true);
        }

    }

    return (
        <div className={'signupPage'}>
            <div className={'signupContainer'}>
                <h2>SIGN UP</h2>
                <form onSubmit={handleSubmitSignup} autoComplete={'off'} className={'signupForm'}>
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
                    <input
                        id="password2"
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        required
                    />
                    <input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                    <button type="submit">SUBMIT</button>
                    {error && <p style={{color: 'red'}}>{errorMsg}</p>}
                    {success && <p style={{color: 'green'}}>You have been sent a confirmation email</p>}
                </form>
                <p>Already have an account? <Link to={'/login'}>Login</Link></p>
                <p>Go back <Link to={'/'}>HOME</Link></p>
            </div>
        </div>
    )
}

export default Signup