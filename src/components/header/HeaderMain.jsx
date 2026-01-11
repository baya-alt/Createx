// src/components/header/HeaderMain.jsx
import createxLogo from "../../assets/CREATEX.png";
import searchIcon from "../../assets/lupa.png";
import heartIcon from "../../assets/jurok.png";
import cartIcon from "../../assets/Cart.png";
import "./header-main.css";
import { useState, useEffect } from "react";

export default function HeaderMain({
  activeMenu,
  onMenuToggle,
  onCartClick,
  onFavoriteClick
}) {
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Загрузка количества товаров из localStorage
  useEffect(() => {
    const loadCartCount = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Считаем общее количество товаров (сумма quantity каждого товара)
        const totalItems = savedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error loading cart count:', error);
        setCartCount(0);
      }
    };

    const loadFavoritesCount = () => {
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavoritesCount(savedFavorites.length);
      } catch (error) {
        console.error('Error loading favorites count:', error);
        setFavoritesCount(0);
      }
    };

    // Загружаем начальные значения
    loadCartCount();
    loadFavoritesCount();

    // Слушаем события обновления корзины и избранного
    const handleCartUpdate = () => {
      loadCartCount();
    };

    const handleFavoritesUpdate = () => {
      loadFavoritesCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    // Также слушаем storage события для синхронизации между вкладками
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartCount();
      }
      if (e.key === 'favorites') {
        loadFavoritesCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="main-header">
      <div className="container main-header-content">
        <a href="/" className="logo">
          <img src={createxLogo} alt="Createx" />
        </a>

        <nav className="main-nav">
          {["women", "men", "girls", "boys", "sale"].map((item) => (
            <a
              key={item}
              href="#"
              className={`${item === "sale" ? "sale-link" : ""} ${
                activeMenu === item ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onMenuToggle(item);
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </nav>

        <div className="search-box">
          <input placeholder="Search for products..." />
          <button>
            <img src={searchIcon} alt="" />
          </button>
        </div>

        <div className="user-icons">
          {/* ❤️ Избранное */}
          <button className="icon-btn" onClick={onFavoriteClick}>
            <img src={heartIcon} alt="Favorites" />
            <span className={`counter ${favoritesCount > 0 ? 'has-items' : ''}`}>
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </span>
          </button>

          {/* 🛒 Корзина */}
          <button className="icon-btn" onClick={onCartClick}>
            <img src={cartIcon} alt="Cart" />
            <span className={`counter green ${cartCount > 0 ? 'has-items' : ''}`}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}