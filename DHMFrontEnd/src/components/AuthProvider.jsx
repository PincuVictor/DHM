import React, {useState} from 'react';
import axios from 'axios';
import AuthContext from "./AuthContext.jsx";

const API_LOGIN = import.meta.env.VITE_API_LOGIN;
const API_REGISTER = import.meta.env.VITE_API_REGISTER;

export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

    const signupUser = async (email, password, password2, firstName, lastName) => {
        try {
            const response = await axios.post(API_REGISTER, {
                email,
                password,
                firstName: firstName,
                lastName: lastName
            });
            console.log(response.data);
            return { success: true };
        } catch (error) {
            let errorMsg = 'Signup failed';
            if (error.response && error.response.data) {
                errorMsg = error.response.data.Detailed || error.response.data.Message || error.response.data.message || error.response.data.title || errorMsg;
            } else {
                errorMsg = error.message;
            }
            console.error('Signup failed:', errorMsg);
            return { success: false, error: errorMsg };
        }
    }

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(API_LOGIN, {email, password})
            setAuthTokens(response.data)
            localStorage.setItem('authTokens', JSON.stringify(response.data))
            console.log(response.data)
            return { success: true }
        } catch (error) {
            let errorMsg = 'Login failed';
            if (error.response && error.response.data) {
                errorMsg = error.response.data.Detailed || error.response.data.Message || error.response.data.message || error.response.data.title || errorMsg;
            } else {
                errorMsg = error.message;
            }
            console.error('Login failed:', errorMsg);
            return { success: false, error: errorMsg }
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        localStorage.removeItem('authTokens')
    }

    const verifyUser = async (email, code) => {
        try {
            const response = await axios.post('http://localhost:5090/api/Auth/verify', { email, code })
            setAuthTokens(response.data)
            localStorage.setItem('authTokens', JSON.stringify(response.data))
            console.log(response.data)
            return { success: true }
        } catch (error) {
            let errorMsg = 'Verification failed';
            if (error.response && error.response.data) {
                errorMsg = error.response.data.Detailed || error.response.data.Message || error.response.data.message || error.response.data.title || errorMsg;
            } else {
                errorMsg = error.message;
            }
            console.error('Verification failed:', errorMsg);
            return { success: false, error: errorMsg }
        }
    }

    const contextData = {
        authTokens,
        signupUser,
        verifyUser,
        loginUser,
        logoutUser
    }

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}

export default AuthProvider;