import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import './HeroSlider.css'; // Подключаем стили
import menslide from '../../assets/menslide.png'
import womenslide from '../../assets/womenslide.png'
import kidsslide from '../../assets/kidsslide.png'

// Данные для слайдов с добавлением path для навигации
const slides = [
    {
        id: 1,
        subtitle: "NEW COLLECTION",
        title: "Menswear 2025",
        image: menslide,
        bgColor: "#F4EFE9",
        ctaText: "Shop the menswear",
        path: "/men", // Путь для навигации
        salePath: "/sale?category=men" // Путь для распродажи мужской одежды
    },
    {
        id: 2,
        subtitle: "SUMMER SALE",
        title: "Womenswear 2025",
        image: womenslide,
        bgColor: "#E9F0F4",
        ctaText: "Shop the womenswear",
        path: "/women", // Путь для навигации
        salePath: "/sale?category=women" // Путь для распродажи женской одежды
    },
    {
        id: 3,
        subtitle: "KIDS COLLECTION",
        title: "For Boys & Girls",
        image: kidsslide,
        bgColor: "#F4E9F0",
        ctaText: "Shop the kids",
        path: "/kids", // Путь для навигации
        salePath: "/sale?category=kids" // Путь для распродажи детской одежды
    },
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const length = slides.length;
    const navigate = useNavigate(); // Хук для навигации

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    // Функция для перехода по категории
    const handleCategoryClick = (path) => {
        navigate(path);
    };

    // Функция для перехода на страницу распродажи
    const handleSaleClick = () => {
        // Можно сделать несколько вариантов:
        
        // Вариант 1: Переход на общую страницу распродажи
        navigate('/sale');
        
        // Вариант 2: Переход на распродажу текущей категории
        // navigate(slides[current].salePath);
        
        // Вариант 3: Открыть модальное окно с распродажными товарами
        // openSaleModal();
    };

    // Альтернативная функция - переход на распродажу текущей категории
    const handleSaleCategoryClick = () => {
        navigate(slides[current].salePath);
    };

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    return (
        <section className="hero-section" style={{ backgroundColor: slides[current].bgColor }}>

            {/* Левая стрелка навигации */}
            <button className="arrow-btn left-arrow" onClick={prevSlide}>
                &#8592;
            </button>

            {/* Основной контент */}
            <div className="container">
                <div className="content-wrapper">

                    {/* Текстовая часть */}
                    <div className="text-col">
                        <h3 className="subtitle">{slides[current].subtitle}</h3>
                        <h1 className="title">{slides[current].title}</h1>

                        <div className="cta-buttons">
                            {/* Кнопка Shop sale - ведет на страницу распродажи */}
                            <button 
                                className="btn btn-outline"
                                onClick={handleSaleClick}
                            >
                                Shop sale
                            </button>
                            
                            {/* Кнопка Shop category - ведет на страницу категории */}
                            <button 
                                className="btn btn-filled"
                                onClick={() => handleCategoryClick(slides[current].path)}
                            >
                                {slides[current].ctaText}
                            </button>
                        </div>

                        {/* Пагинация (01 02 03 04) */}
                        <div className="pagination">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`page-number ${index === current ? 'active' : ''}`}
                                    onClick={() => setCurrent(index)}
                                >
                                    0{index + 1}
                                    {index === current && <div className="progress-bar"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Картинка */}
                    <div className="image-col">
                        {/* Используем key, чтобы анимация срабатывала при смене слайда */}
                        <img key={current} src={slides[current].image} alt="Fashion Model" className="hero-image" />
                    </div>

                </div>
            </div>

            {/* Правая стрелка навигации */}
            <button className="arrow-btn right-arrow" onClick={nextSlide}>
                &#8594;
            </button>

        </section>
    );
};

export default HeroSlider;