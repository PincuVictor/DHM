import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import '../stylesheets/Navbar.css'
import { ReactComponent as Logo } from "../assets/logo1.svg"
import { ReactComponent as CartIcon } from "../assets/shopping-cart.svg"
import { useCart } from '../hooks/useCart'
import useAuth from '../hooks/useAuth'

const NavLink = ({ to, children, onClick }) => {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <li className="nav-item">
            <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`} onClick={onClick}>
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
    const { isAdmin } = useAuth()
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="logo-container" onClick={() => { closeMobileMenu(); navigate('/'); }}>
                        <Logo className="logo" />
                    </div>
                    
                    <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>

                    <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
                        <NavLink to="/" onClick={closeMobileMenu}>HOME</NavLink>
                        <NavLink to="/drop" onClick={closeMobileMenu}>DROP</NavLink>
                        <NavLink to="/shop" onClick={closeMobileMenu}>SHOP</NavLink>
                        {isAdmin && <NavLink to="/admin" onClick={closeMobileMenu}>ADMIN</NavLink>}
                        <NavLink to="/account" onClick={closeMobileMenu}>ACCOUNT</NavLink>
                        
                        <li className="cart-container" onClick={() => { closeMobileMenu(); navigate('/cart'); }}>
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