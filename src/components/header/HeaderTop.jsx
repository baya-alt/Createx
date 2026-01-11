import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Добавляем useNavigate
import loginIcon from "../../assets/login.png";
import america from "../../assets/america.webp";
import russia from "../../assets/russia.webp";
import "./header-top.css";

export default function HeaderTop({
  user,
  onLoginClick,
  onLogout,
  onProfileClick
}) {
  const [lang, setLang] = useState("en");
  const [openLang, setOpenLang] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userRef = useRef(null);
  const navigate = useNavigate(); // Добавляем навигацию

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Функция для перехода на страницу Delivery
  const handleDeliveryClick = () => {
    navigate('/delivery'); // Переход на страницу Delivery
  };

  return (
    <div className="top-bar">
      <div className="container top-bar-content">

        {/* LEFT */}
        <a
          href="https://wa.me/996225325666"
          className="availability"
          target="_blank"
          rel="noreferrer"
        >
          Available 24/7 at <strong>(225) 325 666</strong>
        </a>

        {/* CENTER */}
        <nav className="top-nav">
          {/* Изменяем на использование функции навигации */}
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleDeliveryClick(); // Вызываем навигацию
            }}
          >
            <span className="nav-link-text">Delivery & returns</span>
            <span className="nav-link-hint">View details →</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-link-text">Track order</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-link-text">Blog</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-link-text">Contacts</span>
          </a>
        </nav>

        {/* RIGHT */}
        <div className="top-actions">

          {/* 🌍 LANGUAGE */}
          <div
            className="lang-wrapper"
            tabIndex={0}
            onBlur={() => setOpenLang(false)}
          >
            <button
              className="lang-btn"
              onClick={() => setOpenLang(!openLang)}
            >
              <img
                src={lang === "en" ? america : russia}
                alt=""
                className="flag-icon"
              />
              {lang === "en" ? "ENG / $" : "РУС / ₽"}
              <span className="arrow-down">▼</span>
            </button>

            {openLang && (
              <div className="lang-dropdown">
                <div onMouseDown={() => setLang("en")}>
                  <img src={america} alt="" /> English / $
                </div>
                <div onMouseDown={() => setLang("ru")}>
                  <img src={russia} alt="" /> Русский / ₽
                </div>
              </div>
            )}
          </div>

          {/* 👤 USER */}
          <div className="user-auth" ref={userRef}>
            <button
              className="login-btn"
              onClick={() =>
                user
                  ? setOpenUserMenu(p => !p)
                  : onLoginClick()
              }
            >
              <img src={loginIcon} alt="" />
              {user ? user.name : "Log in / Register"}
            </button>

            {user && openUserMenu && (
              <div className="user-dropdown">
                <div
                  className="user-dropdown-item"
                  onClick={() => {
                    setOpenUserMenu(false);
                    onProfileClick(); 
                  }}
                >
                  Profile
                </div>

                {/* 🚪 LOGOUT */}
                <div
                  className="user-dropdown-item logout"
                  onClick={() => {
                    setOpenUserMenu(false);
                    onLogout();
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}