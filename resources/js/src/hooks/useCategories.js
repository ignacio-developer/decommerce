import { useState, useEffect } from 'react';
import { getBlogCategories, getCategories } from '../services/baseService';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('There was an error fetching categories:', error);
                setError('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    return { categories, error };
};

const useBlogCategories = () => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const data = await getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error('There was an error fetching blog categories:', error);
                setError('Error fetching blog categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { blogCategories, error, loading };
};

// Export both hooks
export { useCategories, useBlogCategories };
