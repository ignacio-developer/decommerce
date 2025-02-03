import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from "@/src/context/CartContext.jsx";
import { Link } from 'react-router-dom';

const CartDropdown = ({ cartItems, onClose }) => {

    const baseUrl = import.meta.env.VITE_APP_URL;
    const { removeFromCart, clearCart } = useContext(CartContext);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the animation when the component mounts
        setIsVisible(true);
    }, []);

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.on_sale ? parseFloat(item.on_sale_price) : parseFloat(item.price);
        const itemTotal = price * item.quantity;
        return total + itemTotal;
    }, 0);

    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const formattedTotalPrice = subtotal.toFixed(2);

    // Don't render the dropdown if the cart is empty
    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className={`cart-dropdown ${isVisible ? 'animate' : ''}`}>
            <ul>
                {cartItems.slice(0, 5).map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                        <Link to={`/product-details/${item.id}`} onClick={onClose}
                              style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                            <img className="cart-item-image"
                                 src={`${baseUrl}/storage/${item.images[0]?.image_url}`} 
                                 alt={item.name}
                                 style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                        </Link>
                        <div style={{ flex: 1 }}>
                            <Link to={`/product-details/${item.id}`} onClick={onClose}
                                  style={{ textDecoration: 'none', color: 'black' }}>
                                <h5 style={{ margin: '0', fontSize: '16px' }}>{item.name}</h5>
                            </Link>
                            <p style={{ margin: '5px 0 0', fontSize: '14px' }}>
                                ${item.on_sale ? item.on_sale_price : item.price} x {item.quantity}
                            </p>
                        </div>
                        <span className="icon_close" style={{ fontSize: '24px', padding: '10px', cursor: 'pointer' }}
                              onClick={() => handleRemove(item.id)} />
                    </li>
                ))}
            </ul>
            <div className="subtotal">
                <h5>Subtotal: ${formattedTotalPrice}</h5>
            </div>
            <div className="button-container"
                 style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a href="/cart" className="primary-btn-cart-view">View Cart</a>
                <button onClick={handleClearCart} className="primary-btn-cart-clear">Clear</button>
            </div>
        </div>
    );
};

export default CartDropdown;
