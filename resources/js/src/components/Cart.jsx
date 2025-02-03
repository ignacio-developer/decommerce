import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import Footer from "@/src/components/Footer.jsx";
import Header from "@/src/components/Header.jsx";
import Hamburger from "@/src/components/Hamburger.jsx";
import { CartContext } from "@/src/context/CartContext.jsx";
import axios from 'axios'; // For handling coupon API requests

const Cart = () => {
    const baseUrl = import.meta.env.VITE_APP_URL;

    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const [items, setItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);

    const handleRemove = (productId) => {
        console.log('Removing product with ID:', productId);
        removeFromCart(productId);
    };

    useEffect(() => {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        } else {
            setItems(cartItems);
        }
    }, [cartItems]);

    const calculateSubtotal = () => {
        return items.reduce((total, item) => {
            const price = item.on_sale ? parseFloat(item.on_sale_price) : parseFloat(item.price);
            const itemTotal = price * item.quantity;
            return total + itemTotal;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const formattedSubtotal = subtotal.toFixed(2);

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/apply-coupon', { coupon_code: couponCode });
            if (response.data.valid) {
                setDiscountPercent(response.data.percent);
                setCouponError('');
            } else {
                setCouponError('Invalid or expired coupon');
            }
        } catch (error) {
            setCouponError('Invalid or expired coupon');
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = items.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    const discountAmount = (subtotal * discountPercent) / 100;
    const totalAfterDiscount = (subtotal - discountAmount).toFixed(2);

    localStorage.setItem('discountAmount', discountAmount);
    localStorage.setItem('totalAfterDiscount', totalAfterDiscount);

    return (
        <>
            <Hamburger />
            <Header />

            {/* Hero Section Begin */}
            <section className="hero hero-normal">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="hero__categories">
                                <div className="hero__categories__all">
                                    <i className="fa fa-bars" />
                                    <span>All departments</span>
                                </div>
                                <ul>
                                    <li><a href="#">Fresh Meat</a></li>
                                    <li><a href="#">Vegetables</a></li>
                                    <li><a href="#">Fruit & Nut Gifts</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="hero__search">
                                <div className="hero__search__form">
                                    <form action="#">
                                        <div className="hero__search__categories">
                                            All Categories
                                            <span className="arrow_carrot-down" />
                                        </div>
                                        <input type="text" placeholder="What do you need?" />
                                        <button type="submit" className="site-btn">SEARCH</button>
                                    </form>
                                </div>
                                <div className="hero__search__phone">
                                    <div className="hero__search__phone__icon">
                                        <i className="fa fa-phone" />
                                    </div>
                                    <div className="hero__search__phone__text">
                                        <h5>+65 11.188.888</h5>
                                        <span>support 24/7 time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Hero Section End */}

            {/* Breadcrumb Section Begin */}
            <section className="breadcrumb-section set-bg" style={{ backgroundImage: "url('img/breadcrumb.jpg')" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <h2>Shopping Cart</h2>
                                <div className="breadcrumb__option">
                                    <a href="./index.html">Home</a>
                                    <span>Shopping Cart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {items.length > 0 ? (
                <section className="shoping-cart spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="shoping__cart__table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th className="shoping__product">Products</th>
                                            <th>Price</th>
                                            <th className="quantity">Quantity</th>
                                            <th className="total">Total</th>
                                            <th/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="shoping__cart__item">
                                                    <img
                                                        src={`${baseUrl}/storage/${item.images[0]?.image_url}`} 
                                                        alt={item.name} style={{width: '100px', height: 'auto'}}/>
                                                    <h5>{item.name}</h5>
                                                </td>
                                                <td className="shoping__cart__price">${item.on_sale ? item.on_sale_price : item.price}</td>
                                                <td className="shoping__cart__quantity">
                                                    <div className="quantity">
                                                        <button
                                                            className="quantity-btn"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                        <input
                                                            type="text"
                                                            value={item.quantity || 1}
                                                            readOnly
                                                            className="quantity-input"
                                                        />
                                                        <button
                                                            className="quantity-btn"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                                    </div>
                                                </td>

                                                <td className="shoping__cart__total">
                                                    ${item.on_sale ? (item.on_sale_price * item.quantity).toFixed(2) : (item.price * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="shoping__cart__item__close">
                                                    <span className="icon_close" onClick={() => handleRemove(item.id)}/>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="shoping__cart__btns">
                                    <a href="/shop" className="primary-btn cart-btn">CONTINUE SHOPPING</a>
                                    <a href="#" className="primary-btn cart-btn cart-btn-right"
                                       onClick={() => clearCart()}>
                                        <i className="fa fa-trash"/> Clear Cart
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="shoping__continue">
                                    <div className="shoping__discount">
                                        <h5>Discount Codes</h5>
                                        <form onSubmit={handleApplyCoupon}>
                                            <input
                                                type="text"
                                                placeholder="Enter your coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button type="submit" className="site-btn">APPLY COUPON</button>
                                        </form>
                                        {couponError && <p style={{ color: 'red' }}>{couponError}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="shoping__checkout">
                                    <h5>Cart Total</h5>
                                    <ul>
                                        <li>Subtotal <span>${formattedSubtotal}</span></li>
                                        {discountPercent > 0 && <li>Discount <span>-{discountPercent}%</span></li>}
                                        <li>Total <span>${totalAfterDiscount}</span></li>
                                    </ul>
                                    <a href="/checkout" className="primary-btn">PROCEED TO CHECKOUT</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <div className="empty-cart-message">
                    <h2>Your cart is empty</h2>
                    <a href="/shop" className="primary-btn">GO SHOPPING</a>
                </div>

            )}

            <Footer/>
        </>
    );
};

export default Cart;
