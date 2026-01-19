import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";

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
import Footer from "../footer/Footer"; // ✅ Добавляем импорт футера

function Layout() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [cartOpen, setCartOpen] = useState(() => localStorage.getItem("cartOpenState") === "true");
  const [favOpen, setFavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // ✅ Используем тот же ключ, что и в Register
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showEnjoy, setShowEnjoy] = useState(false);

  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoriteItemsCount, setFavoriteItemsCount] = useState(0);

  const menuRef = useRef(null);

  // ✅ Слушаем изменения в localStorage для пользователя
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartOpenState", cartOpen.toString());
  }, [cartOpen]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItemsCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const updateFavoriteCount = () => {
      const fav = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavoriteItemsCount(fav.length);
    };
    updateFavoriteCount();
    window.addEventListener("favoritesUpdated", updateFavoriteCount);
    return () => window.removeEventListener("favoritesUpdated", updateFavoriteCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showEnjoy && typeof window !== "undefined") {
      document.querySelector(".enjoy-wrapper")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showEnjoy]);

  const handleDeliveryClick = () => setShowEnjoy(true);
  const handleAccountClick = () => user ? setProfileOpen(true) : setAuthOpen(true);
  const handleOpenCart = () => setCartOpen(true);

  // ✅ Функция для обновления пользователя (будет вызвана из HeaderTop при логауте)
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setProfileOpen(false);
  };

  return (
    <div className="layout-container">
      {/* Хедер отображается на каждой странице */}
      <HeaderTop
        user={user}
        onLoginClick={() => setAuthOpen(true)}
        onProfileClick={() => setProfileOpen(true)}
        onLogout={handleLogout}
        onDeliveryClick={handleDeliveryClick}
      />

      <div ref={menuRef} style={{ position: "relative" }}>
        <HeaderMain
          activeMenu={activeMenu}
          onMenuToggle={(m) => setActiveMenu(p => p === m ? null : m)}
          onCartClick={() => setCartOpen(true)}
          onFavoriteClick={() => setFavOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onAccountClick={handleAccountClick}
          cartCount={cartItemsCount}
          favoriteCount={favoriteItemsCount}
        />

        {activeMenu && (
          <CategoriesMenu
            data={MENU_DATA[activeMenu]}
            onCategoryClick={() => setActiveMenu(null)}
          />
        )}
      </div>

      <HeaderSale />

      {showEnjoy && <Enjoy onClose={() => setShowEnjoy(false)} />}

      {/* Основной контент страниц */}
      <main className="main-content">
        <Outlet context={{ openCart: handleOpenCart }} />
      </main>

      {/* Футер отображается на каждой странице */}
      <Footer />

      {/* Модальные окна */}
      <Favorite open={favOpen} onClose={() => setFavOpen(false)} />
      <Korzina open={cartOpen} onClose={() => setCartOpen(false)} />

      {authOpen && (
        <Register
          onClose={() => setAuthOpen(false)}
          onLogin={(userData) => {
            setUser(userData);
            setAuthOpen(false);
            setProfileOpen(true);
          }}
        />
      )}

      {profileOpen && (
        <Profile
          user={user}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default Layout;