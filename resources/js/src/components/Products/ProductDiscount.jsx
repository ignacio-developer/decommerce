import React, { useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles.css';
import useProducts from "@/src/hooks/useProducts.js";
import { CartContext } from "@/src/context/CartContext.jsx";
import { Link } from "react-router-dom";
import Spinner from "@/src/components/Spinner/Spinner.jsx";

const ProductDiscount = () => {
    const baseUrl = import.meta.env.VITE_APP_URL;

    const { onSaleProducts, isLoading } = useProducts();
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        if (window.swiper) {
            window.swiper.update();
        }
    }, [onSaleProducts]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="product-discount">
            <div className="product-discount-title">
                <h2>Sale Off</h2>
            </div>
            <div className="product-discount-slider">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={10}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    slidesPerView={3}
                    centeredSlides={false}
                    loop={true}
                    speed={1200}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        375: {
                            slidesPerView: 2,
                        },
                        0: {
                            slidesPerView: 1,
                        }
                    }}

                >
                    {onSaleProducts.map((product, index) => (
                        <SwiperSlide key={index}>
                            <Link to={`/product-details/${product.id}`} className="plain-link">
                                <div className="product-item" onClick={(e) => e.stopPropagation()}>
                                    <div className="product-item-pic">
                                        <img
                                            src={`${baseUrl}/storage/${product.images[0]?.image_url}`} 
                                            alt={product.name}
                                        />
                                        <div className="product-item-percent">
                                            -{product.on_sale_percent.toString().includes('.')
                                            ? product.on_sale_percent.toString().split('.')[0]
                                            : product.on_sale_percent}%
                                        </div>

                                        <ul className="product-item-hover" onClick={(e) => e.stopPropagation()}>
                                            <li>
                                                <a href="#" onClick={(e) => e.preventDefault()}>
                                                    <i className="fa fa-heart" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={(e) => e.preventDefault()}>
                                                    <i className="fa fa-retweet" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                                                    <i className="fa fa-shopping-cart" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="product-item-text">
                                        <span>{product.category.name}</span>
                                        <h5>{product.name}</h5>
                                        <div className="product-item-price">
                                            <span className="current-price">${product.on_sale_price}</span>
                                            {product.price && (
                                                <span className="original-price">{product.price}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductDiscount;
