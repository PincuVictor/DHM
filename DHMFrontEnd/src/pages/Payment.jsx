import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import styles from '../stylesheets/Payment.module.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { checkout, cartTotal } = useCart();
    const orderData = location.state?.orderData;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    useEffect(() => {
        if (!orderData) {
            navigate('/checkout');
        }
    }, [orderData, navigate]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 3) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'number') value = formatCardNumber(value);
        if (name === 'expiry') value = formatExpiry(value);
        if (name === 'cvc') value = value.replace(/\D/g, '').substring(0, 4);

        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate Stripe network request delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Submit the order to backend
        const result = await checkout(orderData);
        
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Payment failed. Please try again.');
        }
        
        setLoading(false);
    };

    if (success) {
        return (
            <motion.div 
                className={styles.container}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className={styles.success}>
                    <div className={styles.successIcon}>✓</div>
                    <h2>Payment Successful!</h2>
                    <p>Your order has been placed and is being processed.</p>
                    <Link to="/shop" className={styles.continueBtn}>
                        Continue Shopping
                    </Link>
                </div>
            </motion.div>
        );
    }

    if (!orderData) return null;

    return (
        <motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.paymentBox}>
                <div className={styles.header}>
                    <h2>Complete Payment</h2>
                    <p>Total to pay: ${cartTotal.toFixed(2)}</p>
                </div>

                <form onSubmit={handlePayment} className={styles.stripeForm}>
                    {error && <div className={styles.error}>{error}</div>}
                    
                    <div className={styles.inputRow}>
                        <label>Card Information</label>
                        <div className={styles.cardInputWrapper}>
                            <div className={styles.cardNumberContainer}>
                                <span className={styles.cardIcon}>💳</span>
                                <input 
                                    type="text" 
                                    name="number"
                                    placeholder="Card number"
                                    value={cardData.number}
                                    onChange={handleChange}
                                    maxLength="19"
                                    required
                                    className={styles.stripeInput}
                                />
                            </div>
                            <div className={styles.cardDetailsContainer}>
                                <input 
                                    type="text" 
                                    name="expiry"
                                    placeholder="MM / YY"
                                    value={cardData.expiry}
                                    onChange={handleChange}
                                    maxLength="5"
                                    required
                                    className={`${styles.stripeInput} ${styles.borderLeft}`}
                                />
                                <input 
                                    type="text" 
                                    name="cvc"
                                    placeholder="CVC"
                                    value={cardData.cvc}
                                    onChange={handleChange}
                                    maxLength="4"
                                    required
                                    className={`${styles.stripeInput} ${styles.borderLeft}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <label>Name on card</label>
                        <input 
                            type="text" 
                            name="name"
                            value={cardData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className={styles.standardInput}
                        />
                    </div>

                    <motion.button 
                        type="submit" 
                        className={styles.payBtn}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                    </motion.button>
                    
                    <div className={styles.stripeMockBadge}>
                        <span>🔒 Powered by</span>
                        <strong>Stripe (Mock)</strong>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default Payment;
