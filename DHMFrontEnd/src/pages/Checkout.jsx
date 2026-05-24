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
                    const addr = res.data[0];
                    setFormData({
                        addressLine1: addr.address_line1 || '',
                        addressLine2: addr.address_line2 || '',
                        postalCode: addr.postal_code || '',
                        city: addr.city || '',
                        country: addr.country || ''
                    });
                }
            })
            .catch(err => console.error('Failed to load saved addresses', err));
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

        const result = await checkout(formData);
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error);
        }
        setLoading(false);
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
                
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Address Line 1</label>
                    <input 
                        type="text" 
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        className={styles.input}
                        required
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
                        required
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
                        required
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
                        required
                    />
                </div>

                <motion.button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default Checkout;
