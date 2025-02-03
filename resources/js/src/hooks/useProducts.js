import { useState, useEffect } from 'react';
import { getProducts, getSingleProduct, getTopRatedProducts } from '../services/baseService'; // Import the new function

const useProducts = (id, categoryId) => {
    const [products, setProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]); // State for top-rated products
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTopRated, setLoadingTopRated] = useState(true); // Loading state for top-rated products

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                setError('Error fetching products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchTopRatedProducts = async () => {
            try {
                const data = await getTopRatedProducts(); // Fetch top-rated products
                setTopRatedProducts(data);
            } catch (error) {
                setError('Error fetching top-rated products');
            } finally {
                setLoadingTopRated(false);
            }
        };

        fetchTopRatedProducts();
    }, []); // Run this effect once when the hook is used

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const productData = await getSingleProduct(id);
                    setProduct(productData);
                } catch (error) {
                    setError('Product not found');
                }
            };

            fetchProduct();
        }
    }, [id]);

    const onSaleProducts = products.filter(product => product.on_sale);
    const categoryProducts = products.filter(product => product.category_id === parseInt(categoryId));

    const getRelatedProducts = (currentProductId) => {
        return products
            .filter(product => product.id !== currentProductId)
            .slice(0, 4);
    };

    return {
        products,
        getTopRatedProducts,
        product,
        onSaleProducts,
        categoryProducts,
        error,
        isLoading,
        loadingTopRated,
        getRelatedProducts
    };
};

export default useProducts;
