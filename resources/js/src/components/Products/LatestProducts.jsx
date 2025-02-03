import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from "react-router-dom";
import 'swiper/css';


const LatestProducts = ({ products, swiperOptions }) => {

    const baseUrl = import.meta.env.VITE_APP_URL;

    const groupProducts = (products, itemsPerGroup) => {
        const groups = [];
        for (let i = 0; i < products.length; i += itemsPerGroup) {
            groups.push(products.slice(i, i + itemsPerGroup));
        }
        return groups;
    };

    const lastSixProducts = products.slice(-6);
    const groupedProducts = groupProducts(lastSixProducts, 3);

    return (
        <Swiper
            key={lastSixProducts.map(product => product.id).join('-')}
            className='latest-product__slider'
            loop={true}
            modules={[Autoplay]}
            autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            speed={1200}
            {...swiperOptions}
        >
            {groupedProducts.map((group, groupIndex) => (
                <SwiperSlide key={groupIndex} className="latest-product__slider__item">
                    {group.map((product, index) => (
                        <Link to={`/product-details/${product.id}`} key={index} className="latest-product__item">
                            <div className="latest-product__item__pic">
                                <img
                                    src={`${baseUrl}/storage/${product.images[0]?.image_url}`} 
                                    alt={product.name}
                                />
                            </div>
                            <div className="latest-product__item__text">
                                <h6>{product.name}</h6>
                                <h5 style={{color: product.on_sale ? 'red' : 'black', fontWeight: "bold"}}>
                                ${product.on_sale ? product.on_sale_price : product.price}
                                </h5>
                            </div>
                        </Link>
                    ))}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default LatestProducts;
