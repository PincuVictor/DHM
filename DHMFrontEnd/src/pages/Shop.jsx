import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import styles from '../stylesheets/Shop.module.css';

const Shop = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const { products, totalCount, loading, error } = useProducts(searchTerm, null, false, pageNumber, 12);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPageNumber(1);
    };

    const totalPages = Math.ceil(totalCount / 12);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <motion.div 
            className={styles.shopContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>The Collection</h1>
                <p className={styles.subtitle}>Discover our latest drops</p>
            </div>

            <div className={styles.filters}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {loading ? (
                <div className={styles.loading}>Loading latest heat...</div>
            ) : error ? (
                <div className={styles.loading}>{error}</div>
            ) : (
                <>
                    <motion.div 
                        className={styles.productGrid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {products.map(product => (
                            <motion.div 
                                key={product.id} 
                                className={styles.productCard}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div className={styles.imageContainer}>
                                    {product.imageUrl ? (
                                        <img 
                                            src={`${product.imageUrl}`} 
                                            alt={product.name} 
                                            className={styles.productImage} 
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image"; }}
                                        />
                                    ) : (
                                        <img src="https://via.placeholder.com/300?text=No+Image" alt="Placeholder" className={styles.productImage} />
                                    )}
                                </div>
                                <div className={styles.productInfo}>
                                    <div className={styles.productCategory}>{product.categoryName}</div>
                                    <div className={styles.productName}>{product.name}</div>
                                    <div className={styles.productPrice}>${product.price.toFixed(2)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button 
                                className={styles.pageButton} 
                                disabled={pageNumber === 1}
                                onClick={() => setPageNumber(prev => prev - 1)}
                            >
                                Previous
                            </button>
                            <span>{pageNumber} / {totalPages}</span>
                            <button 
                                className={styles.pageButton} 
                                disabled={pageNumber === totalPages}
                                onClick={() => setPageNumber(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default Shop;
