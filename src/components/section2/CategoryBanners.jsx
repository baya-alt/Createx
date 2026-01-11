import React from 'react';
import './CategoryBanners.css';

// Подключаем Link, чтобы переход работал без перезагрузки
import { Link } from "react-router-dom";

import womens from '../../assets/womens.png';
import mens from '../../assets/mens.png';
import kids from '../../assets/kids.png';
import SubscribeForm from '../footer/SubscribeForm';
import Footer from '../footer/Footer';
import Popularcategories from '../Popularcategories/Popularcategories';
import Salemin from '../salemin/Salemin';
import Enjoy from '../enjoy/Enjoy';
import Insta from '../insta/Insta';
import Fashionblog from '../Fashionblog/Fashionblog';

const categories = [
    { name: "Women's", image: womens, link: "/women" },
    { name: "Men's", image: mens, link: "/men" },
    { name: "Kids'", image: kids, link: "/kids" },
];

const CategoryBanners = () => {
    return (
        <section className="category-banners-section">
            <div className="container">
                <div className="banners-grid">
                    {categories.map((category, index) => (
                        <Link 
                            to={category.link} 
                            key={index} 
                            className="category-banner-card"
                        >
                            <div className="image-wrapper">
                                <img 
                                    src={category.image}
                                    alt={category.name}
                                    className="category-image"
                                />
                            </div>
                            <h3 className="category-name">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
            <Popularcategories/>
            <Salemin/>
            <Enjoy/>
            <Insta/>
            <Fashionblog/>
            <SubscribeForm/>
            <Footer/>

        </section>
    );
};

export default CategoryBanners;
