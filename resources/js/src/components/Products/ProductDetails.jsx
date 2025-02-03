import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import ReactOwlCarousel from 'react-owl-carousel';
import Footer from "@/src/components/Footer.jsx";
import Header from "@/src/components/Header.jsx";
import Hamburger from "@/src/components/Hamburger.jsx";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Spinner from "@/src/components/Spinner/Spinner.jsx";
import useProducts from "@/src/hooks/useProducts.js";
import {CartContext} from "@/src/context/CartContext.jsx";
import {useUserContext} from "@/src/context/UserContext.jsx";

const ProductDetails = () => {
    const baseImgURL = './/';
    const baseUrl = import.meta.env.VITE_APP_URL;

    const {id} = useParams();
    const {addToCart} = useContext(CartContext);
    const {getRelatedProducts, product, error} = useProducts(parseInt(id));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const {user, isLoggedIn} = useUserContext();
    const [loading, setLoading] = useState(false);
    const [expandedReviews, setExpandedReviews] = useState({});
    const [newReview, setNewReview] = useState({comment: '', rating: 0});
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(0);
    const loggedInUserId = user?.id;
    const relatedProducts = getRelatedProducts(parseInt(id));
    const [largeImageSrc, setLargeImageSrc] = useState('default.jpg');
    const [showReviews, setShowReviews] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState(null);


    const [localReviews, setLocalReviews] = useState([]);

    useEffect(() => {
        if (product?.reviews) {
            setLocalReviews(product.reviews);
        }
    }, [product]);


    const toggleReviews = () => {
        setShowReviews(!showReviews);
    };

    const ratingLabels = [
        "Poor",
        "Fair",
        "Good",
        "Very Good",
        "Excellent"
    ];

    const getRatingLabel = () => {
        if (hoveredStar > 0) {
            return <span className="rating-label">{ratingLabels[hoveredStar - 1]}</span>;
        } else if (selectedStar > 0) {
            return <span className="rating-label">{ratingLabels[selectedStar - 1]}</span>;
        } else {
            return <span className="rating-label">Rate Product</span>;
        }
    };




    const toggleExpand = (index) => {
        setExpandedReviews(prevState => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };


    useEffect(() => {
        setLoading(true);

        if (product && product.images && product.images.length > 0) {
            setLargeImageSrc(`${baseImgURL}${product.images[0].image_url}`);
            setImages(product.images.slice(1));
        }

        setLoading(false);
    }, [product]);

    const handleImageClick = (src, index) => {
        setLargeImageSrc(src);
        setCurrentIndex(index);
        setImages(images.filter((_, i) => i !== index));
    }

    const handleRatingChange = (star) => {
        setSelectedStar(star);
        setNewReview({...newReview, rating: star});
    };

    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem('token'); // Get token from local storage
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); // Get CSRF token from the meta tag

        if (!token) {
            console.error('No authentication token found');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken // Add CSRF token here
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            // Optionally update the state to remove the deleted review from the list
            const updatedReviews = localReviews.filter((review) => review.id !== reviewId);
            setLocalReviews(updatedReviews);

            console.log('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        const reviewTitle = selectedStar > 0 ? ratingLabels[selectedStar - 1] : null;

        const reviewData = {
            productId: id,
            userId: user.id,
            comment: newReview.comment,
            rating: newReview.rating,
            title: reviewTitle,
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const response = await fetch(`${baseUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result.message);

            // Update the localReviews state to include the new review
            const newReviewData = {
                ...reviewData,
                id: result.review.id,
                user: {
                    id: user.id,
                    name: user.name,
                },
                created_at: new Date().toISOString(),
            };

            setLocalReviews((prevReviews) => [...prevReviews, newReviewData]);

            // Reset the form
            setNewReview({ comment: '', rating: 0 });
            setSelectedStar(0);
            setShowReviewForm(false);

        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };


    const handleEditReview = (review) => {
        setEditMode(true);
        setReviewToEdit(review);
        setNewReview({ comment: review.comment, rating: review.rating });
        setShowReviewForm(true); // Open form in edit mode
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            comment: newReview.comment,
            rating: newReview.rating,
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const response = await fetch(`${baseUrl}/reviews/${reviewToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error('Failed to update review');
            }

            const result = await response.json();

            setLocalReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id === reviewToEdit.id ? { ...review, ...reviewData } : review
                )
            );

            setEditMode(false);
            setReviewToEdit(null);
            setNewReview({ comment: '', rating: 0 });
            setShowReviewForm(false);
        } catch (error) {
            console.error('Error editing review:', error);
        }
    };




    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0, behavior: 'smooth'
        });
    };

    const handleProductClick = () => {
        setLoading(true);
    }


    const options = {
        items: 1,
        margin: 10,
        nav: true,
        responsive: {
            0: {items: 1}, 600: {items: 3}, 1000: {items: 4},
        },
    };

    if (loading || !product) return <Spinner />;

    if (error) return <div>{error}</div>;

    return (<>
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
                                    <li>
                                        <a href="#">Fresh Meat</a>
                                    </li>
                                    <li>
                                        <a href="#">Vegetables</a>
                                    </li>
                                    <li>
                                        <a href="#">Fruit &amp; Nut Gifts</a>
                                    </li>
                                    <li>
                                        <a href="#">Fresh Berries</a>
                                    </li>
                                    <li>
                                        <a href="#">Ocean Foods</a>
                                    </li>
                                    <li>
                                        <a href="#">Butter &amp; Eggs</a>
                                    </li>
                                    <li>
                                        <a href="#">Fastfood</a>
                                    </li>
                                    <li>
                                        <a href="#">Fresh Onion</a>
                                    </li>
                                    <li>
                                        <a href="#">Papayaya &amp; Crisps</a>
                                    </li>
                                    <li>
                                        <a href="#">Oatmeal</a>
                                    </li>
                                    <li>
                                        <a href="#">Fresh Bananas</a>
                                    </li>
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
                                        <input type="text" placeholder="What do yo u need?"/>
                                        <button type="submit" className="site-btn">
                                            SEARCH
                                        </button>
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
            <section
                className="breadcrumb-section set-bg"
                style={{backgroundImage: "url('../img/breadcrumb.jpg')"}}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <h2>Vegetable’s Package</h2>
                                <div className="breadcrumb__option">
                                    <a href="/">Home</a>
                                    <a href="/">Vegetables</a>
                                    <span>Vegetable’s Package</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}
            {/* Product Details Section Begin */}
            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="product__details__pic">
                                <div className="product__details__pic__item">
                                    <img
                                        className="product__details__pic__item--large"
                                        src={`${baseUrl}/storage/${product.images[0]?.image_url}`} 
                                        alt="Large Product"
                                    />
                                </div>

                                {product && product.images && product.images.length > 1 && (
                                    <ReactOwlCarousel
                                        {...options}
                                        className="product__details__pic__slider owl-carousel"
                                        key={largeImageSrc}
                                    >
                                        {product.images.map((image, index) => {
                                            const imageUrl = `${baseImgURL}${image.image_url}`;
                                            // Don't show the current large image in the slider
                                            if (imageUrl === largeImageSrc) return null;
                                            return (
                                                <div className="item" key={index}>
                                                    <img
                                                        onClick={() => handleImageClick(imageUrl, index)}
                                                        src={imageUrl}
                                                        alt={`Product ${index + 1}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </ReactOwlCarousel>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="product__details__text">
                                <h3>{product.name}</h3>
                                <div className="product__details__rating">
                                    <i className="fa fa-star"/>
                                    <i className="fa fa-star"/>
                                    <i className="fa fa-star"/>
                                    <i className="fa fa-star"/>
                                    <i className="fa fa-star-half-o"/>
                                    <span>({localReviews.length} reviews)</span>
                                </div>
                                <div className="product__details__price">
                                    {product.on_sale ? (
                                        <>
                                            <span style={{
                                                color: 'red',
                                                marginRight: '10px'
                                            }}>${product.on_sale_price}</span>
                                            <span style={{
                                                textDecoration: 'line-through',
                                                color: 'black',
                                                fontSize: '0.8em'
                                            }}>${product.price}</span>
                                        </>
                                    ) : (
                                        <span>${product.price}</span>
                                    )}
                                </div>

                                <p>{product.description}</p>
                                <div className="product__details__quantity">
                                    <div className="quantity-details">
                                        <div className="pro-qty">
                                            <input type="text" defaultValue={1}/>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" className="primary-btn" onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                }}>
                                    ADD TO CART
                                </a>

                                <a href="#" className="heart-icon">
                                    <span className="icon_heart_alt"/>
                                </a>
                                <ul>
                                    <li>
                                        <b>Availability</b> <span>{product.quantity} In Stock</span>
                                    </li>
                                    <li>
                                        <b>Shipping</b>{" "}
                                        <span>
                                01 day shipping. <samp>Free pickup today</samp>
                            </span>
                                    </li>
                                    <li>
                                        <b>Weight</b> <span>0.5 kg</span>
                                    </li>
                                    <li>
                                        <b>Share on</b>
                                        <div className="share">
                                            <a href="#">
                                                <i className="fa fa-facebook"/>
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-twitter"/>
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-instagram"/>
                                            </a>
                                            <a href="#">
                                                <i className="fa fa-pinterest"/>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="product__details__tab">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="tabs-1" role="tabpanel">
                                        <div
                                            className="product__details__tab__desc"
                                            style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                        >
                                            <h6 style={{margin: 0}}>Product Information</h6>
                                            <span onClick={toggleReviews} className="review-toggle">
                    {showReviews ? 'Hide Reviews' : 'Reviews'}
                </span>
                                        </div>
                                        {!showReviews && <p>{product.description}</p>}
                                    </div>

                                    {showReviews && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {/* Review Form at the top */}
                                            <div className="add-review-container">
                                                {/* Clickable Title to Toggle Form */}
                                                <div
                                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                                    style={{cursor: 'pointer', display: 'inline-block'}}
                                                >
                                                    <h6 className="add-review-title">
                                                        {showReviewForm ? 'Cancel' : editMode ? 'Edit Review' : 'Add Review'}
                                                    </h6>
                                                </div>

                                                {/* Conditionally Render Review Form */}
                                                {(showReviewForm || editMode) && (
                                                    <form onSubmit={editMode ? handleEditSubmit : handleReviewSubmit}
                                                          className="add-review-form">
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                placeholder="Write your review here..."
                                required
                                rows={4}
                            />
                                                        <div>
                                                            <label>{getRatingLabel()}</label>
                                                            <div className="star-rating">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <span
                                                                        key={star}
                                                                        onClick={() => handleRatingChange(star)}
                                                                        onMouseEnter={() => setHoveredStar(star)}
                                                                        onMouseLeave={() => setHoveredStar(0)}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            color:
                                                                                newReview.rating >= star || hoveredStar >= star
                                                                                    ? '#ffc107'
                                                                                    : '#e4e5e9',
                                                                            fontSize: '24px',
                                                                        }}
                                                                    >
                                            ★
                                        </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <button type="submit" className="submit-review">
                                                            {editMode ? 'Save Changes' : 'Submit Review'}
                                                        </button>
                                                        {editMode && (
                                                            <button onClick={() => setEditMode(false)}
                                                                    className="cancel-edit">
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </form>
                                                )}
                                            </div>

                                            {/* Reviews List */}
                                            <ul style={{textAlign: 'center', listStyle: 'none', padding: 0, flex: 1}}>
                                                {localReviews && localReviews.length > 0 ? (
                                                    localReviews.map((review, index) => {
                                                        const isExpanded = expandedReviews[index];
                                                        const displayComment = isExpanded
                                                            ? review.comment
                                                            : `${review.comment.slice(0, 470)}${review.comment.length > 470 ? '...' : ''}`;
                                                        const isReviewOwner = review.user.id === loggedInUserId;

                                                        return (
                                                            <li key={index} style={{marginTop: '25px'}}>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        marginBottom: '2px',
                                                                    }}
                                                                >
                                                                    <h5 className="review-username">{review.user.name}</h5>
                                                                    <small style={{color: '#666', marginLeft: '10px'}}>
                                                                        {new Date(review.created_at).toLocaleDateString('en-GB')}
                                                                    </small>
                                                                </div>
                                                                <div
                                                                    className="review-content"
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    <div
                                                                        className="review-rating"
                                                                        style={{display: 'flex', alignItems: 'center'}}
                                                                    >
                                                                        <span
                                                                            className="filled">{'★'.repeat(review.rating)}</span>
                                                                        <span
                                                                            className="empty">{'☆'.repeat(5 - review.rating)}</span>
                                                                        <span className="review-title"
                                                                              style={{marginLeft: '10px'}}>
                                                {review.title}
                                            </span>
                                                                    </div>

                                                                    {/* Conditionally render edit and delete buttons if the review belongs to the logged-in user */}
                                                                    {isReviewOwner && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleEditReview(review)}
                                                                                className="edit-review-button"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteReview(review.id)}
                                                                                className="delete-review-button"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <p className="review-comment">{displayComment}</p>
                                                                {review.comment.length > 470 && (
                                                                    <button
                                                                        onClick={() => toggleExpand(index)}
                                                                        className="read-more-button"
                                                                    >
                                                                        {isExpanded ? 'Read Less' : 'Read More'}
                                                                    </button>
                                                                )}
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <p>No reviews yet.</p>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details Section End */}
            {/* Related Product Section Begin */}
            <section className="related-product">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title related__product__title">
                                <h2>Related Products</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {relatedProducts.length > 0 ? (relatedProducts.map((relatedProduct) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={relatedProduct.id}>
                                <Link to={`/product-details/${relatedProduct.id}`} className="plain-link" onClick={() => {
                                    handleScrollToTop();
                                    handleProductClick();
                                }}>
                                    <div className="product__item">
                                        <div className="product__item__pic set-bg">
                                            <img
                                                src={`${baseUrl}/storage/${relatedProduct.images[0]?.image_url}`} 
                                                alt={relatedProduct.name}
                                            />

                                            <ul className="product__item__pic__hover">
                                                <li>
                                                    <a href="#">
                                                        <i className="fa fa-heart"/>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa fa-retweet"/>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(relatedProduct);
                                                    }}>
                                                        <i className="fa fa-shopping-cart"/>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="product__item__text">
                                            <h6>{relatedProduct.name}</h6>
                                            <h5>${relatedProduct.on_sale_price || relatedProduct.price}</h5>
                                        </div>
                                    </div>
                                </Link>

                            </div>))) : (<div className="col-lg-12">
                            <p>No related products found.</p>
                        </div>)}
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    </>);
};

export default ProductDetails;
