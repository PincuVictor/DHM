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
const Shop = lazy(() => import('./pages/Shop.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));

import Layout from './components/Layout.jsx';
import CartProvider from './components/CartProvider.jsx';

function App() {
    return (
        <>
            <AuthProvider>
                <CartProvider>
                    <Suspense fallback={<div> Loading... </div>}>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/drop" element={<Home />} />
                                <Route path="/contact" element={<Home />} />
                                <Route path="/account" element={<Account />} />
                            </Route>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/verify-email/:uidb64/:token" element={<EmailVerify />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </CartProvider>
            </AuthProvider>
        </>
    )
}

export default App