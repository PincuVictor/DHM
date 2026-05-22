import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import styles from '../stylesheets/Cart.module.css';

const Cart = () => {
    const { cartItems, cartTotal, removeFromCart, loading } = useCart();
    const navigate = useNavigate();

    if (loading) return <div className={styles.emptyCart}>Loading cart...</div>;

    if (!cartItems || cartItems.length === 0) {
        return (
            <motion.div 
                className={styles.emptyCart}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <h2>Your cart is empty.</h2>
                <Link to="/shop" className={styles.continueShopping}>Continue Shopping</Link>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className={styles.cartContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className={styles.title}>Your Cart</h1>
            
            <div className={styles.cartList}>
                <AnimatePresence>
                    {cartItems.map(item => (
                        <motion.div 
                            key={item.productId}
                            className={styles.cartItem}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                        >
                            <div className={styles.itemInfo}>
                                <div className={styles.itemName}>{item.productName}</div>
                                <div className={styles.itemPrice}>${item.unitPrice.toFixed(2)}</div>
                                <div className={styles.itemQuantity}>Qty: {item.quantity}</div>
                            </div>
                            <div className={styles.itemActions}>
                                <button 
                                    className={styles.removeBtn}
                                    onClick={() => removeFromCart(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className={styles.summary}>
                <div className={styles.total}>Total: ${cartTotal.toFixed(2)}</div>
                <button 
                    className={styles.checkoutBtn}
                    onClick={() => navigate('/checkout')}
                >
                    Proceed to Checkout
                </button>
            </div>
        </motion.div>
    );
};

export default Cart;
