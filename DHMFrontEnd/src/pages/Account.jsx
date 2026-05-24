import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit, FaTrash, FaSignOutAlt, FaBoxOpen, FaMapMarkerAlt, FaUser, FaEnvelope } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth.jsx'
import '../stylesheets/Account.css'

const API_SHIPPING = import.meta.env.VITE_API_SHIPPING
const API_ORDERS = 'http://localhost:5090/api/Orders'

function Account() {
    const navigate = useNavigate()
    const { logoutUser } = useAuth()

    const [activeTab, setActiveTab] = useState('info')
    
    const [credentials, setCredentials] = useState({ email: '', first_name: '', last_name: '' })
    const [orders, setOrders] = useState([])
    const [shippingAddresses, setShippingAddresses] = useState([])
    
    // Shipping Form State
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [editAddressId, setEditAddressId] = useState(null)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [addressForm, setAddressForm] = useState({
        address_line1: '', address_line2: '', city: '', postal_code: '', country: ''
    })

    // Contact Form State
    const [contactForm, setContactForm] = useState({ subject: '', message: '' })
    const [contactSent, setContactSent] = useState(false)

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return

        setCredentials({
            email: token.user?.email || '',
            first_name: token.user?.firstName || '',
            last_name: token.user?.lastName || ''
        })

        fetchShipping()
        fetchOrders()
    }, [])

    const fetchShipping = () => {
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return
        fetch(API_SHIPPING, {
            headers: { 'Authorization': `Bearer ${token.token}` }
        })
        .then(res => res.json())
        .then(data => setShippingAddresses(data))
        .catch(err => console.error('Error fetching shipping:', err))
    }

    const fetchOrders = () => {
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return
        fetch(API_ORDERS, {
            headers: { 'Authorization': `Bearer ${token.token}` }
        })
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Error fetching orders:', err))
    }

    const handleSubmitAddress = (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return
        
        const method = isEditingAddress ? 'PUT' : 'POST'
        const url = isEditingAddress ? `${API_SHIPPING}${editAddressId}/` : API_SHIPPING

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`
            },
            body: JSON.stringify(addressForm)
        })
        .then(res => {
            if (res.ok) {
                setShowAddressForm(false)
                setIsEditingAddress(false)
                setEditAddressId(null)
                setAddressForm({ address_line1: '', address_line2: '', city: '', postal_code: '', country: '' })
                fetchShipping()
            }
        })
        .catch(err => console.error('Error saving address:', err))
    }

    const handleDeleteAddress = (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return
        const token = JSON.parse(localStorage.getItem('authTokens'))
        fetch(`${API_SHIPPING}${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token.token}` }
        })
        .then(res => {
            if (res.ok) fetchShipping()
        })
    }

    const handleLogout = async () => {
        await logoutUser()
        navigate('/login')
    }

    const handleContactSubmit = (e) => {
        e.preventDefault()
        
        const payload = {
            subject: contactForm.subject,
            message: contactForm.message,
            userEmail: credentials.email,
            userName: `${credentials.first_name} ${credentials.last_name}`
        }

        fetch('http://localhost:5090/api/Feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => {
            if (res.ok) {
                setContactSent(true)
                setTimeout(() => {
                    setContactSent(false)
                    setContactForm({ subject: '', message: '' })
                }, 4000)
            }
        }).catch(err => console.error('Error sending feedback:', err))
    }

    const renderTabContent = () => {
        switch(activeTab) {
            case 'info':
                return (
                    <motion.div 
                        className="tab-pane info-pane"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <h2>Account Information</h2>
                        <div className="info-card">
                            <div className="info-item">
                                <label>FULL NAME</label>
                                <p>{credentials.first_name} {credentials.last_name}</p>
                            </div>
                            <div className="info-item">
                                <label>EMAIL ADDRESS</label>
                                <p>{credentials.email}</p>
                            </div>
                        </div>
                    </motion.div>
                )
            case 'orders':
                return (
                    <motion.div 
                        className="tab-pane orders-pane"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <h2>Order History</h2>
                        {orders.length === 0 ? (
                            <div className="empty-state">No orders found. Time to cop some drops!</div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <span className="order-id">Order #{order.id}</span>
                                                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                                        </div>
                                        <div className="order-items">
                                            {order.orderItems.map(item => (
                                                <div key={item.id} className="order-item">
                                                    <span>{item.quantity}x {item.productName}</span>
                                                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-total">
                                            <span>Total</span>
                                            <span>${order.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )
            case 'shipping':
                return (
                    <motion.div 
                        className="tab-pane shipping-pane"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <h2>Shipping Addresses</h2>
                        
                        {!showAddressForm ? (
                            <>
                                <div className="address-list">
                                    {shippingAddresses.map((addr, idx) => (
                                        <div key={addr.id || idx} className="address-card">
                                            <div className="address-actions">
                                                <FaEdit className="action-icon edit" onClick={() => {
                                                    setAddressForm(addr)
                                                    setEditAddressId(addr.id)
                                                    setIsEditingAddress(true)
                                                    setShowAddressForm(true)
                                                }} />
                                                <FaTrash className="action-icon delete" onClick={() => handleDeleteAddress(addr.id)} />
                                            </div>
                                            <p className="addr-line">{addr.address_line1}</p>
                                            {addr.address_line2 && <p className="addr-line">{addr.address_line2}</p>}
                                            <p className="addr-line">{addr.city}, {addr.postal_code}</p>
                                            <p className="addr-line">{addr.country}</p>
                                        </div>
                                    ))}
                                </div>
                                {shippingAddresses.length < 5 && (
                                    <button className="glass-btn add-btn" onClick={() => setShowAddressForm(true)}>
                                        + ADD NEW ADDRESS
                                    </button>
                                )}
                            </>
                        ) : (
                            <form className="glass-form" onSubmit={handleSubmitAddress}>
                                <div className="form-group">
                                    <input type="text" placeholder="Address Line 1" value={addressForm.address_line1} onChange={e => setAddressForm({...addressForm, address_line1: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="Address Line 2 (Optional)" value={addressForm.address_line2} onChange={e => setAddressForm({...addressForm, address_line2: e.target.value})} />
                                </div>
                                <div className="form-row">
                                    <input type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                                    <input type="text" placeholder="Postal Code" value={addressForm.postal_code} onChange={e => setAddressForm({...addressForm, postal_code: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="Country" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} required />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="glass-btn primary">SAVE ADDRESS</button>
                                    <button type="button" className="glass-btn secondary" onClick={() => {
                                        setShowAddressForm(false)
                                        setIsEditingAddress(false)
                                        setAddressForm({ address_line1: '', address_line2: '', city: '', postal_code: '', country: '' })
                                    }}>CANCEL</button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )
            case 'contact':
                return (
                    <motion.div 
                        className="tab-pane contact-pane"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <h2>Contact Support</h2>
                        <p className="contact-desc">Have an issue with an order or a drop? Send us a message and we'll get back to you.</p>
                        
                        {contactSent ? (
                            <div className="success-message">
                                <h3>Message Sent!</h3>
                                <p>Our support team will reach out to {credentials.email} shortly.</p>
                            </div>
                        ) : (
                            <form className="glass-form contact-form" onSubmit={handleContactSubmit}>
                                <div className="form-group">
                                    <input type="text" placeholder="Subject" value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <textarea placeholder="How can we help?" rows="5" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} required></textarea>
                                </div>
                                <button type="submit" className="glass-btn primary">SEND MESSAGE</button>
                            </form>
                        )}
                    </motion.div>
                )
            default:
                return null
        }
    }

    if (!JSON.parse(localStorage.getItem('authTokens'))) {
        return (
            <div className="account-container no-auth">
                <div className="glass-panel text-center">
                    <h2>UNAUTHORIZED</h2>
                    <p>You must be logged in to view your account.</p>
                    <Link to="/login" className="glass-btn primary">LOGIN NOW</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="account-container">
            <div className="account-layout">
                {/* Sidebar Navigation */}
                <div className="account-sidebar glass-panel">
                    <div className="user-greeting">
                        <div className="avatar">{credentials.first_name.charAt(0)}{credentials.last_name.charAt(0)}</div>
                        <h3>Hi, {credentials.first_name}</h3>
                    </div>
                    <ul className="nav-menu">
                        <li className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
                            <FaUser /> Account Info
                        </li>
                        <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                            <FaBoxOpen /> Order History
                        </li>
                        <li className={activeTab === 'shipping' ? 'active' : ''} onClick={() => setActiveTab('shipping')}>
                            <FaMapMarkerAlt /> Shipping Details
                        </li>
                        <li className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>
                            <FaEnvelope /> Contact Us
                        </li>
                    </ul>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="account-content glass-panel">
                    <AnimatePresence mode="wait">
                        {renderTabContent()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Account