import { useState, useEffect } from 'react';
import axios from 'axios';

const API_PRODUCTS = 'http://localhost:5090/api/Products';

export const useProducts = (searchTerm = '', categoryId = null, isUpcoming = null, pageNumber = 1, pageSize = 10) => {
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `${API_PRODUCTS}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
                if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
                if (categoryId) url += `&categoryId=${categoryId}`;
                if (isUpcoming !== null) url += `&isUpcoming=${isUpcoming}`;

                const response = await axios.get(url);
                if (isMounted) {
                    setProducts(response.data.items);
                    setTotalCount(response.data.totalCount);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch products');
                    console.error(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [searchTerm, categoryId, pageNumber, pageSize]);

    return { products, totalCount, loading, error };
};

export default useProducts;
