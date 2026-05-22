import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartContext from './CartContext';
import { useAuth } from '../hooks/useAuth';

const API_CART = 'http://localhost:5090/api/Cart';
const API_ORDERS = 'http://localhost:5090/api/Orders';

export const CartProvider = ({ children }) => {
    const { authTokens } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Cart on load if authenticated
    useEffect(() => {
        if (authTokens?.token) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [authTokens]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_CART, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });
            setCartItems(response.data?.cartItems || []);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!authTokens?.token) return false;
        try {
            const response = await axios.post(`${API_CART}/items?productId=${productId}&quantity=${quantity}`, {}, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });
            setCartItems(response.data?.cartItems || []);
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    };

    const removeFromCart = async (productId) => {
        if (!authTokens?.token) return false;
        try {
            await axios.delete(`${API_CART}/items/${productId}`, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });
            fetchCart();
            return true;
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            return false;
        }
    };

    const clearCart = async () => {
        if (!authTokens?.token) return false;
        try {
            await axios.delete(API_CART, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });
            setCartItems([]);
            return true;
        } catch (error) {
            console.error('Failed to clear cart:', error);
            return false;
        }
    };

    const checkout = async (addressData) => {
        if (!authTokens?.token) return { success: false, error: 'Not authenticated' };
        try {
            const response = await axios.post(API_ORDERS, addressData, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });
            setCartItems([]);
            return { success: true, order: response.data };
        } catch (error) {
            console.error('Checkout failed:', error);
            return { success: false, error: error.response?.data?.message || 'Checkout failed' };
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const contextData = {
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        checkout
    };

    return <CartContext.Provider value={contextData}>{children}</CartContext.Provider>;
};

export default CartProvider;
