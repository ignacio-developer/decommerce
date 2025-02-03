import React, {useContext, useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Header from "@/src/components/Header.jsx";
import Footer from "@/src/components/Footer.jsx";
import Hamburger from "@/src/components/Hamburger.jsx";
import {CartContext} from "@/src/context/CartContext.jsx";
import useDebounce from "@/src/hooks/useDebounce.jsx";
import econtService from "@/src/services/econtService.js";
import { toast } from "react-toastify";

const deliveryIcon = ".//images/products/bus-icon.png";
const econtIcon = ".//images/products/econt-icon.png";
import * as baseService from "../services/baseService";

const Checkout = () => {
    const {cartItems, clearCart} = useContext(CartContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        buyer_name: '',
        buyer_email: '',
        buyer_phone: '',
        order_info: '',
        econt_city: '',
        econt_street: '',
        econt_street_number: '',
        econt_street_id: '',
        econt_city_id: '',
        econt_office_id: '',
        econt_office: '',
        delivery_type: 'econt_office',
        payment_method: "at_delivery",
    });
    const [deliveryType, setDeliveryType] = useState('econt_office');
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [offices, setOffices] = useState([]);
    const [isOfficeDropdownOpen, setOfficeDropdownOpen] = useState(false);
    const [isStreetDropdownOpen, setStreetDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    const econtCity = useDebounce(formData.econt_city, 500);
    const econtStreet = useDebounce(formData.econt_street, 500);
    const econtOffice = useDebounce(formData.econt_office, 500);

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.on_sale ? parseFloat(item.on_sale_price) : parseFloat(item.price);
        return total + price * item.quantity;
    }, 0);

    const discountAmount = parseFloat(localStorage.getItem('discountAmount')) || 0;
    const totalAfterDiscount = parseFloat(localStorage.getItem('totalAfterDiscount')) || 0;

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    };

    const handleDeliveryType = (type) => {
        setDeliveryType(type);
        setFormData((prevFormData) => ({...prevFormData, delivery_type: type}));
    };

    const handleEcontStates = (updates) => {
        setFormData((prevFormData) => ({...prevFormData, ...updates}));
        if (updates.econt_office_id) setOfficeDropdownOpen(false);
        if (updates.econt_street_id) setStreetDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const items = Array.isArray(cartItems) ? cartItems : [];

        try {
            const response = await fetch('http://localhost:8001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    ...formData,
                    items,
                    subtotal,
                    discount: discountAmount,
                    total: totalAfterDiscount
                }),
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                setFormData({
                    buyer_name: '', buyer_email: '', buyer_phone: '', order_info: '', econt_city: '',
                    econt_street: '', econt_street_number: '', econt_street_id: '', econt_city_id: '',
                    econt_office_id: '', econt_office: '', delivery_type: deliveryType,
                });
                clearCart();
                navigate('/thank-you');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to place the order.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const citiesData = await econtService.getCities(econtCity);
            setCities(citiesData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStreets = async () => {
        try {
            const streetsData = await econtService.getStreets(formData.econt_city_id, econtStreet);
            setStreets(streetsData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOffices = async () => {
        try {
            const officesData = await econtService.getOffices(formData.econt_city_id, econtOffice);
            setOffices(officesData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (econtCity) {
            fetchCities();
            if (deliveryType === "econt_office" && formData.econt_city_id) {
                fetchOffices();
            }
        }
    }, [econtCity]);

    useEffect(() => {
        if (formData.econt_city_id) fetchStreets();
    }, [formData.econt_city_id]);

    useEffect(() => {
        if (deliveryType === "econt_office" && formData.econt_city_id) fetchOffices();
    }, [econtOffice]);

    useEffect(() => {
        const data = {
            delivery_type: deliveryType,
            delivery_data: {
                econt_city_id: formData.econt_city_id,
                econt_street_id: formData.econt_street_id,
                econt_office_id: formData.econt_office_id,
                econt_street_number: formData.econt_street_number,
                delivery_type: deliveryType,
            },
        };
        if (deliveryType === "econt_address") {
            if (
                formData.econt_city_id != "" &&
                formData.econt_street_id != ""
            ) {
                baseService
                    .calculateDelivery(data)
                    .then((res) => {
                        if (res.success) {
                            setDeliveryPrice(res.deliveryFee);
                        } else {
                            toast.error(res.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } else if (deliveryType === "econt_office") {
            if (
                formData.econt_city_id != "" &&
                formData.econt_office_id != ""
            ) {
                baseService
                    .calculateDelivery(data)
                    .then((res) => {
                        if (res.success) {
                            setDeliveryPrice(res.deliveryFee.toFixed(2));
                        } else {
                            toast.error(res.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    }, [
        formData.econt_office_id,
        formData.econt_city_id,
        formData.econt_street_id,
    ]);


    console.log(deliveryPrice);

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
                                    <li><a href="#">Fresh Meat</a></li>
                                    <li><a href="#">Vegetables</a></li>
                                    <li><a href="#">Fruit & Nut Gifts</a></li>
                                    <li><a href="#">Fresh Berries</a></li>
                                    <li><a href="#">Ocean Foods</a></li>
                                    <li><a href="#">Butter & Eggs</a></li>
                                    <li><a href="#">Fastfood</a></li>
                                    <li><a href="#">Fresh Onion</a></li>
                                    <li><a href="#">Papayaya & Crisps</a></li>
                                    <li><a href="#">Oatmeal</a></li>
                                    <li><a href="#">Fresh Bananas</a></li>
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
            <section className="breadcrumb-section set-bg" style={{backgroundImage: "url('img/breadcrumb.jpg')"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <h2>Checkout</h2>
                                <div className="breadcrumb__option">
                                    <a href="./index.html">Home</a>
                                    <span>Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Checkout Section Begin */}
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h6><span className="icon_tag_alt"/> Have a coupon? <a href="/cart">Click here to enter your
                                code</a></h6>
                        </div>
                    </div>
                    <div className="checkout__form">
                        <h4>Billing Details</h4>
                        <form>
                            <div className="row">
                                <div className="col-lg-8 col-md-6">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="checkout__input">
                                                <p>Name<span>*</span></p>
                                                <input type="text" name="buyer_name" value={formData.buyer_name}
                                                       onChange={handleInputChange}/>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="checkout__input">
                                                <p>Email<span>*</span></p>
                                                <input type="email" name="buyer_email" value={formData.buyer_email}
                                                       onChange={handleInputChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="checkout__input">
                                        <p>Phone<span>*</span></p>
                                        <input type="text" name="buyer_phone" value={formData.buyer_phone}
                                               onChange={handleInputChange}/>
                                    </div>
                                    <div className="checkout__input">
                                        <p>Order Info<span>*</span></p>
                                        <input type="text" name="order_info" value={formData.order_info}
                                               onChange={handleInputChange}/>
                                    </div>

                                    {/* Econt Delivery Options */}
                                    <div className="econt_input_labels">
                                        <p>Delivery Type<span>*</span></p>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div
                                                className={`type_item ${deliveryType === "econt_office" ? "checked" : ""}`}
                                                style={{
                                                    flex: '0 0 48%',
                                                    cursor: 'pointer',
                                                    border: deliveryType === "econt_office" ? '2px solid blue' : '2px solid transparent',
                                                    padding: '10px',
                                                    textAlign: 'center'
                                                }}
                                                onClick={() => handleDeliveryType("econt_office")}
                                            >
                                                <img src={econtIcon} alt="Econt Office"
                                                     style={{width: '100px', height: '70px', objectFit: 'contain'}}/>
                                                <p>Econt Office</p>
                                            </div>
                                            <div
                                                className={`type_item ${deliveryType === "courier" ? "checked" : ""}`}
                                                style={{
                                                    flex: '0 0 48%',
                                                    cursor: 'pointer',
                                                    border: deliveryType === "courier" ? '2px solid blue' : '2px solid transparent',
                                                    padding: '10px',
                                                    textAlign: 'center'
                                                }}
                                                onClick={() => handleDeliveryType("courier")}
                                            >
                                                <img src={deliveryIcon} alt="Courier"
                                                     style={{width: '100px', height: '70px', objectFit: 'contain'}}/>
                                                <p>Courier</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        {/* Conditional Rendering for Econt Office */}
                                        {deliveryType === "econt_office" && (
                                            <div className="col-lg-12 col-md-12">
                                                <div className="row">
                                                    {/* City Selection */}
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="checkout__input">
                                                            <p>City<span>*</span></p>
                                                            <input
                                                                type="text"
                                                                name="econt_city"
                                                                value={formData.econt_city}
                                                                onChange={handleInputChange}
                                                                className="input-econt"
                                                            />
                                                            {cities.length > 0 && (
                                                                <ul className="scrollable-list">
                                                                    {cities.map(city => (
                                                                        <li
                                                                            key={city.econt_city_id}
                                                                            onClick={() =>
                                                                                handleEcontStates({
                                                                                    econt_city: city.name,
                                                                                    econt_city_id: city.econt_city_id,
                                                                                })
                                                                            }
                                                                        >
                                                                            {city.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Econt Office Selection */}
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="checkout__input">
                                                            <p>Econt Office<span>*</span></p>
                                                            <input
                                                                type="text"
                                                                name="econt_office"
                                                                value={formData.econt_office}
                                                                onChange={handleInputChange}
                                                                className="input-econt"
                                                                onFocus={() => setOfficeDropdownOpen(true)}
                                                            />
                                                            {isOfficeDropdownOpen && offices.length > 0 && (
                                                                <ul className="scrollable-list">
                                                                    {offices.map(office => (
                                                                        <li
                                                                            key={office.econt_office_id}
                                                                            onClick={() =>
                                                                                handleEcontStates({
                                                                                    econt_office_id: office.econt_office_id,
                                                                                    econt_office: office.name,
                                                                                })
                                                                            }
                                                                        >
                                                                            {office.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Conditional Rendering for Courier */}
                                        {deliveryType === "courier" && (
                                            <div className="col-lg-12 col-md-12">
                                                <div className="row">
                                                    {/* City Selection */}
                                                    <div className="col-lg-4 col-md-4">
                                                        <div className="checkout__input">
                                                            <p>City<span>*</span></p>
                                                            <input
                                                                type="text"
                                                                name="econt_city"
                                                                className="input-econt"
                                                                value={formData.econt_city}
                                                                onChange={handleInputChange}
                                                            />
                                                            {cities.length > 0 && (
                                                                <ul className="scrollable-list">
                                                                    {cities.map(city => (
                                                                        <li
                                                                            key={city.econt_city_id}
                                                                            onClick={() =>
                                                                                handleEcontStates({
                                                                                    econt_city: city.name,
                                                                                    econt_city_id: city.econt_city_id,
                                                                                })
                                                                            }
                                                                        >
                                                                            {city.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Street Selection */}
                                                    <div className="col-lg-4 col-md-4">
                                                        <div className="checkout__input">
                                                            <p>Street<span>*</span></p>
                                                            <input
                                                                type="text"
                                                                name="econt_street"
                                                                className="input-econt"
                                                                value={formData.econt_street}
                                                                onChange={handleInputChange}
                                                                onFocus={() => setStreetDropdownOpen(true)}
                                                            />
                                                            {isStreetDropdownOpen && streets.length > 0 && (
                                                                <ul className="scrollable-list">
                                                                    {streets.map(street => (
                                                                        <li
                                                                            key={street.econt_street_id}
                                                                            onClick={() => {
                                                                                handleEcontStates({
                                                                                    econt_street_id: street.econt_street_id,
                                                                                    econt_street: street.name,
                                                                                });
                                                                                setStreetDropdownOpen(false);
                                                                            }}
                                                                        >
                                                                            {street.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Street Number */}
                                                    <div className="col-lg-4 col-md-4">
                                                        <div className="checkout__input">
                                                            <p>Street Number<span>*</span></p>
                                                            <input
                                                                type="text"
                                                                className="input-econt"
                                                                name="econt_street_number"
                                                                value={formData.econt_street_number}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter street number"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>



                                    <div className="col-lg-4 col-md-6">
                                    <div className="checkout__order">
                                        <h4>Your Order</h4>
                                        <div className="checkout__order__products">
                                            <ul>
                                                {cartItems.map((item, index) => (
                                                    <li key={index}>
                                                        {item.name} x {item.quantity}
                                                        <span>
                                                            ${item.on_sale ? (item.on_sale_price * item.quantity).toFixed(2) : (item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="checkout__order__subtotal">
                                            <h5>Subtotal <span>${subtotal.toFixed(2)}</span></h5>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="checkout__order__total">
                                                <h5>Discount <span>${discountAmount.toFixed(2)}</span></h5>
                                            </div>
                                        )}
                                        <div className="checkout__order__total">
                                            <h5>Total <span>${totalAfterDiscount.toFixed(2)}</span></h5>
                                        </div>
                                        <button type="submit" className="site-btn" disabled={loading}
                                                onClick={handleSubmit}>
                                            {loading ? 'Processing...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </div>
            </section>
            {/* Checkout Section End */}

            <Footer/>
        </>
    );
};

export default Checkout;
