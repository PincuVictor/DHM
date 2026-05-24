import React from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import '../stylesheets/NavBar.css'
import { ReactComponent as Logo } from "../assets/logo1.svg"
import { ReactComponent as CartIcon } from "../assets/shopping-cart.svg"
import { useCart } from '../hooks/useCart'

const NavLink = ({ to, children }) => {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <li className="nav-item">
            <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
                {children}
            </Link>
            {isActive && (
                <motion.div
                    className="nav-underline"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </li>
    )
}

function NavBar() {
    const { cartCount } = useCart()
    const navigate = useNavigate()

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="logo-container" onClick={() => navigate('/')}>
                        <Logo className="logo" />
                    </div>
                    
                    <ul className="navbar-links">
                        <NavLink to="/">HOME</NavLink>
                        <NavLink to="/drop">DROP</NavLink>
                        <NavLink to="/shop">SHOP</NavLink>
                        <NavLink to="/account">ACCOUNT</NavLink>
                        
                        <li className="cart-container" onClick={() => navigate('/cart')}>
                            <CartIcon className="cart-icon" />
                            {cartCount > 0 && (
                                <motion.span 
                                    className="cart-badge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    key={cartCount}
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default NavBar