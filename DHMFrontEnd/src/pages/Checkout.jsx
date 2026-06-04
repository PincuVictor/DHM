import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import styles from '../stylesheets/Checkout.module.css';

const API_SHIPPING = import.meta.env.VITE_API_SHIPPING;

const Checkout = () => {
    const { cartItems, checkout } = useCart();
    const { authTokens } = useAuth();
    const navigate = useNavigate();
    
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    const [formData, setFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        city: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (authTokens?.token) {
            axios.get(API_SHIPPING, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            })
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setAddresses(res.data);
                    setSelectedAddressId(res.data[0].id);
                    setShowNewAddressForm(false);
                } else {
                    setShowNewAddressForm(true);
                }
            })
            .catch(err => console.error('Failed to load saved addresses', err));
        } else {
            setShowNewAddressForm(true);
        }
    }, [authTokens]);

    if (cartItems.length === 0 && !success) {
        return (
            <div className={styles.checkoutContainer}>
                <h2>Your cart is empty.</h2>
                <Link to="/shop">Go back to shop</Link>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let orderData = formData;

        if (!showNewAddressForm && selectedAddressId) {
            const selected = addresses.find(a => a.id === selectedAddressId);
            if (selected) {
                orderData = {
                    addressLine1: selected.address_line1,
                    addressLine2: selected.address_line2 || '',
                    city: selected.city,
                    postalCode: selected.postal_code,
                    country: selected.country
                };
            }
        } else if (showNewAddressForm && saveNewAddress && authTokens?.token) {
            try {
                const apiFormat = {
                    address_line1: formData.addressLine1,
                    address_line2: formData.addressLine2,
                    city: formData.city,
                    postal_code: formData.postalCode,
                    country: formData.country
                };
                await axios.post(API_SHIPPING, apiFormat, {
                    headers: { Authorization: `Bearer ${authTokens.token}` }
                });
            } catch (err) {
                console.error("Failed to save new address to account", err);
            }
        }

        navigate('/payment', { state: { orderData } });
    };

    if (success) {
        return (
            <motion.div 
                className={styles.checkoutContainer}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className={styles.success}>
                    <div className={styles.successIcon}>✓</div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for shopping with DHM.</p>
                    <Link to="/shop" style={{ color: '#646cff', marginTop: '2rem', display: 'inline-block' }}>
                        Continue Shopping
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className={styles.checkoutContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className={styles.title}>Checkout</h1>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}
                
                {!showNewAddressForm && addresses.length > 0 ? (
                    <div className={styles.addressSelection}>
                        <h3 style={{ margin: 0 }}>Select Delivery Address</h3>
                        <div className={styles.addressList}>
                            {addresses.map(addr => (
                                <div 
                                    key={addr.id} 
                                    className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                >
                                    <p><strong>{addr.address_line1}</strong></p>
                                    {addr.address_line2 && <p>{addr.address_line2}</p>}
                                    <p>{addr.city}, {addr.postal_code}</p>
                                    <p>{addr.country}</p>
                                </div>
                            ))}
                        </div>
                        <button 
                            type="button" 
                            className={styles.addNewBtn}
                            onClick={() => {
                                setShowNewAddressForm(true);
                                setFormData({
                                    addressLine1: '',
                                    addressLine2: '',
                                    postalCode: '',
                                    city: '',
                                    country: ''
                                });
                            }}
                        >
                            + Add New Address
                        </button>
                    </div>
                ) : (
                    <div className={styles.newAddressForm}>
                        {addresses.length > 0 && (
                            <button 
                                type="button" 
                                className={styles.backBtn}
                                onClick={() => setShowNewAddressForm(false)}
                            >
                                ← Back to Saved Addresses
                            </button>
                        )}
                        <h3 style={{ margin: 0 }}>Delivery Address</h3>
                        
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Address Line 1</label>
                            <input 
                                type="text" 
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                className={styles.input}
                                required={showNewAddressForm}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Address Line 2 (Optional)</label>
                            <input 
                                type="text" 
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={styles.input}
                                required={showNewAddressForm}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Postal Code</label>
                            <input 
                                type="text" 
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className={styles.input}
                                required={showNewAddressForm}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Country</label>
                            <input 
                                type="text" 
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={styles.input}
                                required={showNewAddressForm}
                            />
                        </div>

                        {authTokens?.token && (
                            <div className={styles.checkboxGroup}>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={saveNewAddress} 
                                        onChange={(e) => setSaveNewAddress(e.target.checked)} 
                                    />
                                    Save this address to my account
                                </label>
                            </div>
                        )}
                    </div>
                )}

                <motion.button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default Checkout;
