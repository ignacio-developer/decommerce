import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart items from local storage if available, otherwise use an empty array
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    // Function to add items to the cart
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Check if the product is already in the cart
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Update the quantity of the existing item
                const updatedItems = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                return updatedItems;
            } else {
                // Add new item with quantity
                const newItem = { ...product, quantity: 1 };
                const updatedItems = [...prevItems, newItem];
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                return updatedItems;
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => item.id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    // Function to clear all items from the cart
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };



    // Use useEffect to update local storage whenever cartItems change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
