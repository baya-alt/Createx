import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import HeaderTop from "../header/HeaderTop";
import HeaderMain from "../header/HeaderMain";
import HeaderSale from "../header/HeaderSale";
import CategoriesMenu from "../header/CategoriesMenu";
import { MENU_DATA } from "../header/СategoriesData";

import Korzina from "../korzina/Korzina";
import Favorite from "../favorite/Favorite";
import Register from "../header/Register";
import Profile from "../header/Profile";
import Enjoy from "../enjoy/Enjoy";

function Layout() {
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Восстанавливаем состояние корзины из localStorage
  const [cartOpen, setCartOpen] = useState(() => {
    const saved = localStorage.getItem('cartOpenState');
    return saved === 'true' ? true : false;
  });
  
  const [favOpen, setFavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showEnjoy, setShowEnjoy] = useState(false);
  
  // Состояния для счетчиков
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoriteItemsCount, setFavoriteItemsCount] = useState(0);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Сохраняем состояние корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cartOpenState', cartOpen.toString());
  }, [cartOpen]);

  // Обновляем счетчик корзины
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // Обновляем счетчик избранного
  useEffect(() => {
    const updateFavoriteCount = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavoriteItemsCount(favorites.length);
    };

    updateFavoriteCount();
    window.addEventListener('favoritesUpdated', updateFavoriteCount);
    
    return () => window.removeEventListener('favoritesUpdated', updateFavoriteCount);
  }, []);

  // Глобальный обработчик для открытия корзины из других компонентов
  useEffect(() => {
    const handleGlobalOpenCart = () => {
      setCartOpen(true);
    };

    window.addEventListener('openCart', handleGlobalOpenCart);
    
    return () => {
      window.removeEventListener('openCart', handleGlobalOpenCart);
    };
  }, []);

  const handleMenuToggle = (menu) => {
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  const handleAccountClick = () => {
    if (user) {
      setProfileOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  // Функция для навигации к заказам
  const handleViewOrders = () => {
    navigate('/orders');
  };

  // Обработчик клика по Delivery & returns
  const handleDeliveryClick = () => {
    setShowEnjoy(true);
    // Прокручиваем страницу к компоненту Enjoy
    setTimeout(() => {
      document.querySelector('.enjoy-wrapper')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Функция для открытия корзины (можно передавать в дочерние компоненты)
  const handleOpenCart = () => {
    setCartOpen(true);
  };

  // Закрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="layout-container">
      <HeaderTop
        user={user}
        onLoginClick={() => setAuthOpen(true)}
        onProfileClick={() => setProfileOpen(true)}
        onLogout={() => {
          localStorage.removeItem("user");
          setUser(null);
          setProfileOpen(false);
        }}
        onViewOrders={handleViewOrders}
        onDeliveryClick={handleDeliveryClick}
      />

      <div ref={menuRef} style={{ position: "relative" }}>
        <HeaderMain
          activeMenu={activeMenu}
          onMenuToggle={handleMenuToggle}
          onCartClick={() => setCartOpen(true)}
          onFavoriteClick={() => setFavOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onAccountClick={handleAccountClick}
          cartCount={cartItemsCount}
          favoriteCount={favoriteItemsCount}
          onViewOrders={handleViewOrders}
        />

        {activeMenu && (
          <CategoriesMenu
            data={MENU_DATA[activeMenu]}
            onCategoryClick={() => setActiveMenu(null)}
          />
        )}
      </div>

      <HeaderSale />

      {/* Компонент Enjoy */}
      {showEnjoy && (
        <div className="enjoy-section">
          <Enjoy onClose={() => setShowEnjoy(false)} />
        </div>
      )}

      {/* Основной контент */}
      <main className="main-content">
        <Outlet context={{ openCart: handleOpenCart }} />
      </main>

      {/* Избранное */}
      <Favorite
        open={favOpen}
        onClose={() => setFavOpen(false)}
      />

      {/* Корзина - всегда рендерится, состояние контролируется через проп open */}
      <Korzina
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      {/* Регистрация/Авторизация */}
      {authOpen && (
        <Register
          onClose={() => setAuthOpen(false)}
          onLogin={(u) => {
            setUser(u);
            setAuthOpen(false);
            setProfileOpen(true);
          }}
        />
      )}

      {/* Профиль */}
      {profileOpen && user && (
        <Profile
          user={user}
          onClose={() => setProfileOpen(false)}
          onLogout={() => {
            localStorage.removeItem("user");
            setUser(null);
            setProfileOpen(false);
          }}
          onViewOrders={handleViewOrders}
        />
      )}
    </div>
  );
}

export default Layout;