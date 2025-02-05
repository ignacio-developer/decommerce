import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from "@/src/context/CartContext.jsx";
import CartDropdown from './CartDropdown';
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from '@/src/context/UserContext';

const Header = () => {
    const { cartItems } = useContext(CartContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(true);
    const { isLoggedIn, logout } = useUserContext();
    const location = useLocation();

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.on_sale ? parseFloat(item.on_sale_price) : parseFloat(item.price);
        return total + price * item.quantity;
    }, 0);
    const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    const formattedTotalPrice = subtotal.toFixed(2);

    useEffect(() => {
        let timer;
        if (!isHovered && isDropdownOpen) {
            timer = setTimeout(() => setDropdownOpen(false), 2000);
        }
        return () => clearTimeout(timer);
    }, [isHovered, isDropdownOpen]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleLogout = () => {
        logout();
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="header">
            <div className="header__top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="header__top__left">
                                <ul>
                                    <li>
                                        <i className="fa fa-envelope" /> hello@DEcommerce.com
                                    </li>
                                    <li>Free Shipping for all Orders of $99</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="header__top__right">
                                <div className="header__top__right__social">
                                    <a href="#"><i className="fa fa-facebook"/></a>
                                    <a href="#"><i className="fa fa-twitter"/></a>
                                    <a href="#"><i className="fa fa-linkedin"/></a>
                                    <a href="#"><i className="fa fa-pinterest-p"/></a>
                                </div>
                                <div className="header__top__right__language">
                                    <img src="img/language.png" alt=""/>
                                    <div>English</div>
                                    <span className="arrow_carrot-down"/>
                                    <ul>
                                        <li><a href="#">Spanish</a></li>
                                        <li><a href="#">English</a></li>
                                    </ul>
                                </div>
                                {!isLoggedIn ? (
                                    <div className="header__top__right__auth">
                                        <Link to="/login"><i className="fa fa-user"/> Login</Link>
                                    </div>
                                ) : (
                                    <div className="header__top__right__auth">
                                        <Link to="#" onClick={handleLogout}><i className="fa fa-sign-out"/> Logout</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 d-flex justify-content-between align-items-center">
                        <div className="header__logo">
                            <Link to="/"><img src="img/logo22.png" alt=""/></Link>
                        </div>
                        <div className="header__top__right__auth d-lg-none">
                            {!isLoggedIn ? (
                                <Link to="/login"><i className="fa fa-user"/> LOGIN</Link>
                            ) : (
                                <Link to="#" onClick={handleLogout}><i className="fa fa-sign-out"/> LOGOUT</Link>
                            )}
                        </div>
                    </div>
                    <div className="hero__search col-lg-6">
                        <div className="hero__search">
                            <div className="hero__search__form">
                                <form action="#">
                                
                                    <input type="text" placeholder="What do you need?"/>
                                    <button type="submit" className="site-btn">SEARCH</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* 
                    <div className="hero__search col-lg-6">
                        <div className="hero__search__form">
                            <form action="#">
                                <div className="hero__search__categories">
                                    Search
                                </div>
                                <input type="text" placeholder="What do yo u need?"/>
                                <button type="submit" className="site-btn">
                                    SEARCH
                                </button>
                            </form>
                        </div>
                    </div>  
                    */}
                    {/*
                    <div className={`col-lg-3 header__menu ${isMobileMenuOpen ? 'open' : ''}`}>
                       
                    </div>
                    */}
                    <div className="col-lg-3">
                        <div className="header__cart">
                            <ul>
                                <li><a href="#"><i className="fa fa-heart" /> <span>1</span></a></li>
                                <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    <Link to="/cart"><i className="fa fa-shopping-bag" /> <span>{totalQuantity}</span></Link>
                                </li>
                            </ul>
                            <div className="header__cart__price">
                                <span>${formattedTotalPrice}</span>
                            </div>
                        </div>
                        {isDropdownOpen && (
                            <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave}>
                                <CartDropdown cartItems={cartItems} onClose={handleMouseLeave} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="humberger__open" onClick={toggleMobileMenu}>
                    <i className="fa fa-bars" />
                </div>
            </div>
        </header>
    );
};

export default Header;
