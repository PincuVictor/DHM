import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import styles from '../stylesheets/AdminDashboard.module.css';

const API_BASE = 'http://localhost:5090/api';

const AdminDashboard = () => {
    const { isAdmin, authTokens } = useAuth();
    
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);

    // Form States
    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');
    const [catStatus, setCatStatus] = useState(null);

    const [prodName, setProdName] = useState('');
    const [prodDesc, setProdDesc] = useState('');
    const [prodPrice, setProdPrice] = useState('');
    const [prodStock, setProdStock] = useState('');
    const [prodCat, setProdCat] = useState('');
    const [prodRelease, setProdRelease] = useState('');
    const [prodImage, setProdImage] = useState(null);
    const [prodStatus, setProdStatus] = useState(null);
    const [submittingProd, setSubmittingProd] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchCategories();
        }
    }, [isAdmin]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/Categories`);
            setCategories(res.data);
            if (res.data.length > 0) setProdCat(res.data[0].id);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        } finally {
            setLoadingCats(false);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setCatStatus({ type: 'loading' });
        try {
            const res = await axios.post(`${API_BASE}/Categories`, {
                name: catName,
                description: catDesc
            }, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });
            setCatStatus({ type: 'success', message: 'Category added successfully!' });
            setCatName('');
            setCatDesc('');
            fetchCategories(); // Refresh list
        } catch (err) {
            console.error(err);
            setCatStatus({ type: 'error', message: 'Failed to add category' });
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setSubmittingProd(true);
        setProdStatus({ type: 'loading' });

        try {
            let imageUrl = '';
            
            // 1. Upload Image
            if (prodImage) {
                const formData = new FormData();
                formData.append('file', prodImage);
                const uploadRes = await axios.post(`${API_BASE}/Products/upload-image`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authTokens.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            // 2. Create Product
            const productData = {
                name: prodName,
                description: prodDesc,
                price: parseFloat(prodPrice),
                stockQuantity: parseInt(prodStock),
                categoryId: parseInt(prodCat),
                imageUrl: imageUrl,
                isActive: true,
                releaseDate: prodRelease ? new Date(prodRelease).toISOString() : null
            };

            await axios.post(`${API_BASE}/Products`, productData, {
                headers: { Authorization: `Bearer ${authTokens.token}` }
            });

            setProdStatus({ type: 'success', message: 'Product added successfully!' });
            // Reset form
            setProdName('');
            setProdDesc('');
            setProdPrice('');
            setProdStock('');
            setProdImage(null);
            setProdRelease('');
            // Optional: reset file input via ref
        } catch (err) {
            console.error(err);
            setProdStatus({ type: 'error', message: 'Failed to add product' });
        } finally {
            setSubmittingProd(false);
        }
    };

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <p>Manage your catalog and drops</p>
            </div>

            <div className={styles.dashboardLayout}>
                {/* Add Category Panel */}
                <motion.div 
                    className={styles.glassPanel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Add New Category</h2>
                    
                    {catStatus?.type === 'success' && <div className={styles.successMessage}>{catStatus.message}</div>}
                    {catStatus?.type === 'error' && <div className={styles.errorMessage}>{catStatus.message}</div>}

                    <form onSubmit={handleCategorySubmit}>
                        <div className={styles.formGroup}>
                            <label>Category Name</label>
                            <input 
                                type="text" 
                                className={styles.inputField} 
                                value={catName} 
                                onChange={(e) => setCatName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea 
                                className={styles.textareaField} 
                                value={catDesc} 
                                onChange={(e) => setCatDesc(e.target.value)} 
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>Create Category</button>
                    </form>
                </motion.div>

                {/* Add Product Panel */}
                <motion.div 
                    className={styles.glassPanel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2>Add New Product</h2>

                    {prodStatus?.type === 'success' && <div className={styles.successMessage}>{prodStatus.message}</div>}
                    {prodStatus?.type === 'error' && <div className={styles.errorMessage}>{prodStatus.message}</div>}

                    <form onSubmit={handleProductSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <input 
                                    type="text" 
                                    className={styles.inputField} 
                                    value={prodName} 
                                    onChange={(e) => setProdName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select 
                                    className={styles.selectField}
                                    value={prodCat}
                                    onChange={(e) => setProdCat(e.target.value)}
                                    required
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Price ($)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className={styles.inputField} 
                                    value={prodPrice} 
                                    onChange={(e) => setProdPrice(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock Quantity</label>
                                <input 
                                    type="number" 
                                    className={styles.inputField} 
                                    value={prodStock} 
                                    onChange={(e) => setProdStock(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea 
                                className={styles.textareaField} 
                                value={prodDesc} 
                                onChange={(e) => setProdDesc(e.target.value)} 
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Product Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={(e) => setProdImage(e.target.files[0])}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Release Date (Optional - For Upcoming Drops)</label>
                                <input 
                                    type="datetime-local" 
                                    className={styles.inputField} 
                                    value={prodRelease} 
                                    onChange={(e) => setProdRelease(e.target.value)} 
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={submittingProd || categories.length === 0}>
                            {submittingProd ? 'Uploading & Creating...' : 'Create Product'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
