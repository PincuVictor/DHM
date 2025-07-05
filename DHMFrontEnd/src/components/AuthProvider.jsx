import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AuthContext from "./AuthContext.jsx";

const API_LOGIN = import.meta.env.VITE_API_LOGIN;
const API_LOGIN_REFRESH = import.meta.env.VITE_API_LOGIN_REFRESH;
const API_REGISTER = import.meta.env.VITE_API_REGISTER;

export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await axios.post(API_LOGIN_REFRESH, {
                    refresh: authTokens.refresh
                })

                if (response.status === 200) {
                    console.log("Successfully refreshed token")
                    const data = response.data;
                    const updateTokens = {
                        access: data.access,
                        refresh: data.refresh
                    }
                    localStorage.setItem("authTokens", JSON.stringify(updateTokens))
                } else {
                    console.log("Failed to refresh:", response.status)
                }
            } catch (error) {
                console.error("Refresh token failed: ", error)
            }
        };

        const interval = setInterval(refreshToken, 1000 * 60 * 4)
        console.log(interval)

        return () => clearInterval(interval)
    }, [authTokens])

    const signupUser = async (email, password, password2, firstName, lastName) => {
        try {
            const response = await axios.post(API_LOGIN_REFRESH, {
                email,
                password,
                password2,
                first_name: firstName,
                last_name: lastName
            });
            console.log(response.data);
            return true;
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            return false;
        }
    }

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(API_LOGIN,
                {email, password})
            setAuthTokens(response.data)
            localStorage.setItem('authTokens', JSON.stringify(response.data))
            console.log(response.data)
            return true
        } catch (error) {
            console.error('Login failed: ', error)
            return false
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        localStorage.removeItem('authTokens')
    }

    const contextData = {
        authTokens,
        signupUser,
        loginUser,
        logoutUser
    }

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}

export default AuthProvider;