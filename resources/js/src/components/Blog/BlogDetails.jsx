import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "@/src/components/Header.jsx";
import Footer from "@/src/components/Footer.jsx";
import Hamburger from "@/src/components/Hamburger.jsx";
import useArticles from "@/src/hooks/useArticles.js";
import {useBlogCategories} from "@/src/hooks/useCategories.js";
import Spinner from "@/src/components/Spinner/Spinner.jsx";

const BlogDetails = () => {
    const { articles, loading: articleLoading } = useArticles();
    const { blogCategories, loading: blogLoading } = useBlogCategories();
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:8001/article/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    console.log(article);

    if (loading) return <Spinner/>;
    if (error) return <div>Error: {error}</div>;
    if (!article) return <div>No article found</div>;

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
                                    <li><a href="#">Fruit &amp; Nut Gifts</a></li>
                                    <li><a href="#">Fresh Berries</a></li>
                                    <li><a href="#">Ocean Foods</a></li>
                                    <li><a href="#">Butter &amp; Eggs</a></li>
                                    <li><a href="#">Fastfood</a></li>
                                    <li><a href="#">Fresh Onion</a></li>
                                    <li><a href="#">Papayaya &amp; Crisps</a></li>
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

            {/* Blog Details Hero Begin */}
            <section
                className="blog-details-hero set-bg"
                style={{ backgroundImage: `url('/img/blog/details/details-hero.jpg')` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog__details__hero__text">
                                <h2>{article.title}</h2>
                                <ul>
                                    <li>Yanev</li>
                                    <li>{new Date(article.published_at).toLocaleDateString('bg-BG', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}</li>
                                    <li>8 Comments</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Blog Details Hero End */}

            {/* Blog Details Section Begin */}
            <section className="blog-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-5 order-md-1 order-2">
                            <div className="blog__sidebar">
                                <div className="blog__sidebar__search">
                                    <form action="#">
                                        <input type="text" placeholder="Search..."/>
                                        <button type="submit">
                                            <span className="icon_search"/>
                                        </button>
                                    </form>
                                </div>
                                <div className="blog__sidebar__item">
                                    <h4>Categories</h4>
                                    <ul>
                                        {blogCategories.map((category) => (
                                            <li key={category.id}>
                                                <a href="#">{category.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="blog__sidebar__item">
                                    <h4>Recent News</h4>
                                    <div className="blog__sidebar__recent">
                                        {articles.length > 0 ? (
                                            articles.slice(-3).reverse().map((article) => (
                                                <a
                                                    href={`/blog/${article.id}`}
                                                    className="blog__sidebar__recent__item"
                                                    key={article.id} // Use a unique key, such as article ID
                                                >
                                                    <div className="blog__sidebar__recent__item__pic">
                                                        <img
                                                            src={`${article.image}`}
                                                            alt={article.title || 'Article Image'}
                                                        />
                                                    </div>
                                                    <div className="blog__sidebar__recent__item__text">
                                                        <h6>
                                                            {article.title}
                                                        </h6>
                                                        <span>{new Date(article.created_at).toLocaleDateString()}</span> {/* Format the article date */}
                                                    </div>
                                                </a>
                                            ))
                                        ) : (
                                            <p>No recent news available.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="blog__sidebar__item">
                                    <h4>Search By</h4>
                                    <div className="blog__sidebar__item__tags">
                                        <a href="#">Apple</a>
                                        <a href="#">Beauty</a>
                                        <a href="#">Vegetables</a>
                                        <a href="#">Fruit</a>
                                        <a href="#">Healthy Food</a>
                                        <a href="#">Lifestyle</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-7 order-md-1 order-1">
                            <div className="blog__details__text">
                                <img src={`${article.image}`} alt=""/>
                                <p>{article.content}</p>
                                <h3>
                                    The corner window forms a place within a place that is a resting
                                    point within the large space.
                                </h3>
                                <p>
                                    The study area is located at the back with a view of the vast
                                    nature. Together with the other buildings, a congruent story has
                                    been managed in which the whole has a reinforcing effect on the
                                    components. The use of materials seeks connection to the main
                                    house, the adjacent stables.
                                </p>
                            </div>
                            <div className="blog__details__content">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="blog__details__author">
                                            <div className="blog__details__author__pic">
                                                <img src="img/blog/details/details-author.jpg" alt=""/>
                                            </div>
                                            <div className="blog__details__author__text">
                                                <h6>{article.author}</h6>
                                                <span>Admin</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="blog__details__widget">
                                            <ul>
                                                <li><span>Categories:</span> {article.category.name}</li>
                                                {/*<li><span>Tags:</span> Apple, Fresh, Fruits</li>*/}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Blog Details Section End */}

            <Footer/>
        </>
    );
};

export default BlogDetails;
