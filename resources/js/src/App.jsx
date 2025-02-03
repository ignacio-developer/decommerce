import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Shop from './components/Shop/Shop.jsx';
import Cart from './components/Cart.jsx';
import Blog from './components/Blog/Blog.jsx';
import Checkout from './components/Checkout.jsx';
import BlogDetails from './components/Blog/BlogDetails.jsx';
import ProductDetails from './components/Products/ProductDetails.jsx';
import {CartProvider} from '@/src/context/CartContext.jsx';
import Register from "@/src/components/Register/Register.jsx";
import CategoryProducts from "@/src/components/Products/CategoryProducts.jsx";
import Login from "@/src/components/Login/Login.jsx";
import {UserProvider} from "@/src/context/UserContext.jsx";
import ResetPassword from "@/src/components/ResetPassword/ResetPassword.jsx";
import NotFound from "@/src/components/NotFound.jsx";
import ThankYouPage from "@/src/components/ThankYouPage.jsx";

function App() {
    return (
        <UserProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/shop" element={<Shop/>}/>
                        <Route path="/product-details/:id" element={<ProductDetails/>}/>
                        <Route path="/category/:categoryId" element={<CategoryProducts/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/blog" element={<Blog/>}/>
                        <Route path="/blog/:id" element={<BlogDetails/>}/>
                        <Route path="/checkout" element={<Checkout/>}/>
                        <Route path="/thank-you" element={<ThankYouPage/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </CartProvider>
        </UserProvider>

    );
}

export default App;
