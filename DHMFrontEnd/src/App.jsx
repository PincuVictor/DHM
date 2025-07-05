import {lazy, Suspense} from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import {AuthProvider} from "./components/AuthProvider.jsx"


const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const EmailVerify = lazy(() => import('./pages/EmailVerify.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));


function App() {
    return (
        <>
            <AuthProvider>
                <Suspense fallback={<div> Loading... </div>}>
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
                                <Login/>
                        }/>
                        <Route path="/signup" element={
                                <Signup/>
                        }/>
                        <Route path="/verify-email/:uidb64/:token" element={
                            <EmailVerify/>
                        }/>
                        <Route path="*" element={
                            <NotFound/>
                        }/>
                    </Routes>
                </Suspense>
            </AuthProvider>
        </>
    )
}

export default App