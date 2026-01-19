import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import loginIcon from "../../assets/login.png";
import america from "../../assets/america.webp";
import russia from "../../assets/russia.webp";
import "./header-top.css";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HeaderTop({
  user,
  onLoginClick,
  onLogout,
  onProfileClick,
  onDeliveryClick = () => {},
  onTrackOrderClick = () => {},
  onBlogClick = () => {},
  onContactsClick = () => {}
}) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      const savedPhoto = localStorage.getItem(`profilePhoto_${user.id}`);
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    const handlePhotoChange = () => {
      if (user?.id) {
        const savedPhoto = localStorage.getItem(`profilePhoto_${user.id}`);
        setProfilePhoto(savedPhoto);
      }
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoChange);
    
    const handleStorageChange = (e) => {
      if (e.key === `profilePhoto_${user?.id}`) {
        setProfilePhoto(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setOpenLang(false);
      }
      
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = useCallback((newLang) => {
    setLang(newLang);
    setOpenLang(false);
  }, [setLang]);

  const getInitial = () => {
    if (!user) return "";
    
    const name = user.name || user.firstName || user.email?.split('@')[0] || "";
    if (name && typeof name === 'string' && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleUserMenuToggle = useCallback(() => {
    if (user) {
      setOpenUserMenu(prev => !prev);
    } else {
      onLoginClick();
    }
  }, [user, onLoginClick]);

  const handleProfileClick = useCallback(() => {
    setOpenUserMenu(false);
    if (onProfileClick) {
      onProfileClick();
    }
  }, [onProfileClick]);

  const handleLogoutClick = useCallback(() => {
    setOpenUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  const handleDeliveryNavigate = useCallback(() => {
    navigate('/delivery');
  }, [navigate]);

  const handleBlogNavigate = useCallback(() => {
    navigate('/blog');
  }, [navigate]);

  const handleContactsNavigate = useCallback(() => {
    navigate('/contacts');
  }, [navigate]);

  const handleOrdersNavigate = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

  const handleTrackOrderNavigate = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

  return (
    <div className="top-bar">
      <div className="container top-bar-content">

        <a
          href="https://wa.me/996225325666"
          className="availability"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Contact us on WhatsApp"
        >
          Available 24/7 at <strong>(225) 325 666</strong>
        </a>

        <nav className="top-nav" aria-label="Secondary navigation">
          <button 
            className="nav-link" 
            onClick={handleDeliveryNavigate}
            aria-label="Delivery and returns information"
          >
            <span className="nav-link-text">{t("headerTop.delivery")}</span>
          </button>

          <button 
            className="nav-link" 
            onClick={handleTrackOrderNavigate}
            aria-label="Track your order"
          >
            <span className="nav-link-text">{t("headerTop.trackOrder")}</span>
          </button>

          <button 
            className="nav-link" 
            onClick={handleBlogNavigate}
            aria-label="Visit our blog"
          >
            <span className="nav-link-text">{t("headerTop.blog")}</span>
          </button>

          <button 
            className="nav-link" 
            onClick={handleContactsNavigate}
            aria-label="Contact us"
          >
            <span className="nav-link-text">{t("headerTop.contacts")}</span>
          </button>
        </nav>

        <div className="top-actions">

          

          <div 
            className="user-auth" 
            ref={userRef}
            aria-expanded={openUserMenu}
          >
            <button
              className="login-btn"
              onClick={handleUserMenuToggle}
              aria-haspopup="true"
              aria-controls="user-dropdown"
              aria-label={user ? "Open user menu" : "Login or register"}
            >
              {user ? (
                <div className="header-profile-avatar">
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt={user.name || "User"} 
                      className="header-profile-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.header-profile-initial').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="header-profile-initial" style={{ display: profilePhoto ? 'none' : 'flex' }}>
                    {getInitial()}
                  </div>
                </div>
              ) : (
                <img 
                  src={loginIcon} 
                  alt="" 
                  width="16" 
                  height="16" 
                  aria-hidden="true"
                />
              )}
              
              <span className="login-text">
                {user ? ` ${user.name || 'User'}` : t("headerTop.login")}
              </span>
            </button>

            { user && openUserMenu && (
              <div 
                className="user-dropdown" 
                id="user-dropdown"
                role="menu"
              >
                <div className="user-dropdown-header">
                  <div className="dropdown-profile-avatar">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt={user.name || "User"} 
                        className="dropdown-profile-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.dropdown-profile-initial').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="dropdown-profile-initial" style={{ display: profilePhoto ? 'none' : 'flex' }}>
                      {getInitial()}
                    </div>
                  </div>
                  <div className="dropdown-user-info">
                    <div className="user-name">{user.name || "User"}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button
                  className="user-dropdown-item"
                  onClick={handleProfileClick}
                  role="menuitem"
                  aria-label="Go to profile"
                >
                  <span className="dropdown-icon"></span>
                  {t("headerTop.profile")}
                </button>

               

                <div className="dropdown-divider"></div>

                <button
                  className="user-dropdown-item logout"
                  onClick={handleLogoutClick}
                  role="menuitem"
                  aria-label="Logout"
                >
                  <span className="dropdown-icon"></span>
                  {t("headerTop.logout")}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}