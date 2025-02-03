import React, { useContext, useEffect, useState } from 'react';
import Header from "@/src/components/Header.jsx";
import Footer from "@/src/components/Footer.jsx";
import Hamburger from "@/src/components/Hamburger.jsx";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductDiscountCarousel from "@/src/components/Products/ProductDiscount.jsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useProducts from "@/src/hooks/useProducts.js";
import { CartContext } from '../../context/CartContext.jsx';
import ProductCarousel from "@/src/components/Products/LatestProducts.jsx";
import Spinner from "@/src/components/Spinner/Spinner.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import '../styles.css';
import { useCategories } from "@/src/hooks/useCategories.js";

const CategoryProducts = () => {

    const baseUrl = import.meta.env.VITE_APP_URL;

    const { categoryId } = useParams();
    const { addToCart } = useContext(CartContext);
    const { products, error, isLoading, categoryProducts } = useProducts(null, categoryId);

    const { categories } = useCategories();
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState('default');

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const sortedProducts = [...categoryProducts].sort((a, b) => {
        const priceA = a.on_sale ? a.on_sale_price : a.price;
        const priceB = b.on_sale ? b.on_sale_price : b.price;

        if (sortOption === 'price-asc') {
            return priceA - priceB;
        } else if (sortOption === 'price-desc') {
            return priceB - priceA;
        }

        return 0;
    });

    const currentProducts = sortedProducts
        .filter(product => product.price >= minPrice && product.price <= maxPrice)
        .slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const scrollToProducts = () => {
        const productSection = document.getElementById('product-section');
        if (productSection) {
            window.scrollTo({
                top: productSection.offsetTop + 350,
                behavior: 'smooth',
            });
        }
    };

    const carouselOptions = {
        loop: true,
        margin: 10,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        autoplaySpeed: 1000,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 1,
            }
        }
    };

    return (
        <>
            <Hamburger/>
            <Header/>

            {/* Hero Section Begin */}
            <section className="hero hero-normal">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="hero__categories">
                                <div className="hero__categories__all">
                                    <i className="fa fa-bars"/>
                                    <span>All departments</span>
                                </div>
                                <ul>
                                    {categories.length > 0 && categories.map((category) => (
                                        <li key={category.id}>
                                            <a href="#">{category.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="hero__search">
                                <div className="hero__search__form">
                                    <form action="#">
                                        <div className="hero__search__categories">
                                            All Categories
                                            <span className="arrow_carrot-down"/>
                                        </div>
                                        <input type="text" placeholder="What do you need?"/>
                                        <button type="submit" className="site-btn">SEARCH</button>
                                    </form>
                                </div>
                                <div className="hero__search__phone">
                                    <div className="hero__search__phone__icon">
                                        <i className="fa fa-phone"/>
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
            <section className="breadcrumb-section set-bg">
                <img src="/img/breadcrumb.jpg" alt="Breadcrumb" className="breadcrumb-image"/>
                <div className="container">
                    <div className="row">
                        {/*<div className="col-lg-12 text-center">*/}
                        {/*    <div className="breadcrumb__text">*/}
                        {/*        <h2>Fruitify Shop</h2>*/}
                        {/*        <div className="breadcrumb__option">*/}
                        {/*            <a href="/public">Home</a>*/}
                        {/*            <span>Shop</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </section>

            {/* Breadcrumb Section End */}

            {/* Product Section Begin */}
            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-5">
                            <div className="sidebar">
                                <div className="sidebar__item">
                                    <h4>Categories</h4>
                                    <ul>
                                        {categories.length > 0 && categories.map((category) => (
                                            <li key={category.id}>
                                                <Link to={`/category/${category.id}`}>{category.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="sidebar__item">
                                    <h4>Price</h4>
                                    <div className="price-range-wrap">
                                        <div className="range-slider">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            />
                                            <div className="price-input">
                                                <input type="text" className="price-input__field" value={minPrice}
                                                       readOnly/>
                                                <input type="text" className="price-input__field" value={maxPrice}
                                                       readOnly/>
                                                <span className="price-input__currency">$</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sidebar__item sidebar__item__color--option">
                                    <h4>Colors</h4>
                                    <div className="sidebar__item__color sidebar__item__color--white">
                                        <label htmlFor="white">
                                            White
                                            <input type="radio" id="white"/>
                                        </label>
                                    </div>
                                    <div className="sidebar__item__color sidebar__item__color--gray">
                                        <label htmlFor="gray">
                                            Gray
                                            <input type="radio" id="gray"/>
                                        </label>
                                    </div>
                                    <div className="sidebar__item__color sidebar__item__color--red">
                                        <label htmlFor="red">
                                            Red
                                            <input type="radio" id="red"/>
                                        </label>
                                    </div>
                                    <div className="sidebar__item__color sidebar__item__color--black">
                                        <label htmlFor="black">
                                            Black
                                            <input type="radio" id="black"/>
                                        </label>
                                    </div>
                                    <div className="sidebar__item__color sidebar__item__color--blue">
                                        <label htmlFor="blue">
                                            Blue
                                            <input type="radio" id="blue"/>
                                        </label>
                                    </div>
                                    <div className="sidebar__item__color sidebar__item__color--green">
                                        <label htmlFor="green">
                                            Green
                                            <input type="radio" id="green"/>
                                        </label>
                                    </div>
                                </div>

                                <div className="sidebar__item">
                                    <div className="latest-product__text">
                                        <h4>Latest Products</h4>
                                        <ProductCarousel products={products} carouselOptions={carouselOptions}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-7">
                            <ProductDiscountCarousel/>
                            <div className="filter__item">
                                <div className="row">
                                    <div className="col-lg-4 col-md-5">
                                        <div className="filter__sort">
                                            <span>Sort By:</span>
                                            <select onChange={(e) => setSortOption(e.target.value)}>
                                                <option value="default">Default</option>
                                                <option value="price-asc">Price: Low to High</option>
                                                <option value="price-desc">Price: High to Low</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md-5">
                                        <div className="filter__found">
                                            <h6>
                                                <span>{currentProducts.length}</span> Products found
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row" id="product-section">
                                {isLoading ? (
                                    <Spinner/>
                                ) : error ? (
                                    <h2>{error.message}</h2>
                                ) : currentProducts.length > 0 ? (
                                    currentProducts.map(product => (
                                        <div className="col-lg-4 col-md-6 col-sm-6" key={product.id}>
                                            <Link to={`/product-details/${product.id}`} className="product__item"
                                                  style={{textDecoration: 'none', color: 'inherit'}}>
                                                <div className="product__item__pic">
                                                    <img
                                                        src={`${baseUrl}/storage/${product.images[0]?.image_url}`} 
                                                        alt={product.name}
                                                    />
                                                    <ul className="product__item__pic__hover">
                                                        <li>
                                                            <a href="#" onClick={(e) => e.preventDefault()}>
                                                                <i className="fa fa-heart"/>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="#" onClick={(e) => e.preventDefault()}>
                                                                <i className="fa fa-retweet"/>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="#" onClick={(e) => {
                                                                e.preventDefault();
                                                                addToCart(product);
                                                            }}>
                                                                <i className="fa fa-shopping-cart"/>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="product__item__text">
                                                    <h6>{product.name}</h6>
                                                    <h5 style={{color: product.on_sale ? 'red' : 'inherit'}}>
                                                        ${product.on_sale ? product.on_sale_price : product.price}
                                                    </h5>
                                                </div>
                                            </Link>
                                        </div>

                                    ))
                                ) : (
                                    <h2>No products found in this category.</h2>
                                )}
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="product__pagination">
                                        {Array.from({length: totalPages}, (_, i) => (
                                            <a
                                                key={i + 1}
                                                href="#"
                                                className={currentPage === i + 1 ? 'active' : ''}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    paginate(i + 1);
                                                    scrollToProducts();
                                                }}
                                            >
                                                {i + 1}
                                            </a>
                                        ))}
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            paginate(currentPage + 1);
                                            scrollToProducts();
                                        }}>
                                            <i className="fa fa-long-arrow-right"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Product Section End */}
            <Footer/>
        </>
    );
};

export default CategoryProducts;
