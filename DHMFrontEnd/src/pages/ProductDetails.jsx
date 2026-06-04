import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import styles from '../stylesheets/ProductDetails.module.css';

const API_PRODUCTS = '/api/Products';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_PRODUCTS}/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError('Failed to load product details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAdding(true);
        const success = await addToCart(product.id, 1);
        if (success) {
            // Optional: show a toast or feedback
            setAdding(false);
        } else {
            // Might not be logged in
            alert('Please login to add items to your cart.');
            navigate('/login');
        }
    };

    if (loading) return <div className={styles.loading}>Loading product details...</div>;
    if (error) return <div className={styles.loading}>{error}</div>;
    if (!product) return <div className={styles.loading}>Product not found</div>;

    return (
        <div className={styles.pageContainer}>
            <button className={styles.backButton} onClick={() => navigate('/shop')}>
                ← Back to Shop
            </button>
            <motion.div 
                className={styles.detailsContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
            <div className={styles.imageSection}>
                {product.imageUrl ? (
                    <motion.img 
                        src={`${product.imageUrl}`} 
                        alt={product.name} 
                        className={styles.productImage}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600?text=No+Image"; }}
                    />
                ) : (
                    <img src="https://via.placeholder.com/600?text=No+Image" alt="Placeholder" className={styles.productImage} />
                )}
            </div>

            <div className={styles.infoSection}>
                <div className={styles.category}>{product.categoryName}</div>
                <h1 className={styles.title}>{product.name}</h1>
                <div className={styles.price}>${product.price.toFixed(2)}</div>
                
                <p className={styles.description}>
                    {product.description || "No description available for this product."}
                </p>

                {product.releaseDate && new Date(product.releaseDate) > new Date() ? (
                    <div className={styles.comingSoon}>
                        <h3>DROPPING SOON</h3>
                        <p>{new Date(product.releaseDate).toLocaleString()}</p>
                    </div>
                ) : (
                    <motion.button 
                        className={styles.addToCartBtn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={adding}
                    >
                        {adding ? 'Adding...' : 'Add to Cart'}
                    </motion.button>
                )}
            </div>
        </motion.div>
        </div>
    );
};

export default ProductDetails;
