import React from 'react'
import './App.css'
import {Link, Navigate, Route, Routes} from 'react-router'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import {AuthProvider} from "./components/AuthProvider.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Signup from "./pages/Signup.jsx";
import EmailVerify from "./pages/EmailVerify.jsx"

function App() {
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Navbar/>
                            <Home/>
                        </>
                    }/>
                    <Route path="/drop" element={
                        <>
                            <Navbar/>
                            <Home/>
                        </>
                    }/>
                    <Route path="/contact" element={
                        <>
                            <Navbar/>
                            <Home/>
                        </>
                    }/>
                    <Route path="/account" element={
                        <>
                            <Navbar/>
                            <Account/>
                        </>
                    }/>
                    <Route path="/login" element={
                        <>
                            <Login/>
                        </>
                    }/>
                    <Route path="/signup" element={
                        <>
                            <Signup/>
                        </>
                    }/>
                    <Route path="/verify-email/:uidb64/:token" element={<EmailVerify />} />
                </Routes>
            </AuthProvider>
        </>
    )
}
export default App