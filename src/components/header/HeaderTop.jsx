import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import loginIcon from "../../assets/login.png";
import america from "../../assets/america.webp";
import russia from "../../assets/russia.webp";
import "./header-top.css";
import { useLanguage } from "../../contexts/LanguageContext";

// Временная замена иконок - удаляем проблемные импорты
const Phone = () => <span className="icon-placeholder"></span>;
const Truck = () => <span className="icon-placeholder"></span>;
const Package = () => <span className="icon-placeholder"></span>;
const MessageSquare = () => <span className="icon-placeholder"></span>;
const Mail = () => <span className="icon-placeholder"></span>;
const User = () => <span className="icon-placeholder"></span>;
const LogOut = () => <span className="icon-placeholder"></span>;
const ChevronDown = () => <span className="icon-placeholder"></span>;
const Globe = () => <span className="icon-placeholder"></span>;
const Menu = () => <span className="icon-placeholder">☰</span>;
const X = () => <span className="icon-placeholder">✕</span>;
const HomeIcon = () => <span className="icon-placeholder"></span>;
const ShoppingBagIcon = () => <span className="icon-placeholder"></span>;

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const mobileMenuRef = useRef(null);

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
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleBlogNavigate = useCallback(() => {
    navigate('/blog');
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleContactsNavigate = useCallback(() => {
    navigate('/contacts');
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleTrackOrderNavigate = useCallback(() => {
    navigate('/orders');
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleHomeNavigate = useCallback(() => {
    navigate('/');
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleShopNavigate = useCallback(() => {
    navigate('/shop');
    setMobileMenuOpen(false);
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const MobileMenu = () => (
    <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
      <div className="mobile-menu" ref={mobileMenuRef}>
        <div className="mobile-menu-header">
          <button 
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
          <h3 className="mobile-menu-title">{t("headerTop.menu")}</h3>
        </div>
        
        <div className="mobile-menu-content">
          <div className="mobile-contact-info">
            <Phone />
            <a 
              href="tel:+996225325666"
              className="mobile-phone-link"
            >
              (225) 325 666
            </a>
            <span className="mobile-contact-label">{t("headerTop.available24")}</span>
          </div>
          
          <div className="mobile-menu-divider"></div>
          
          <nav className="mobile-nav">
            <button 
              className="mobile-nav-item"
              onClick={handleHomeNavigate}
            >
              <HomeIcon />
              <span>{t("headerTop.home")}</span>
            </button>
            
            <button 
              className="mobile-nav-item"
              onClick={handleShopNavigate}
            >
              <ShoppingBagIcon />
              <span>{t("headerTop.shop")}</span>
            </button>
            
            <button 
              className="mobile-nav-item"
              onClick={handleDeliveryNavigate}
            >
              <Truck />
              <span>{t("headerTop.delivery")}</span>
            </button>
            
            <button 
              className="mobile-nav-item"
              onClick={handleTrackOrderNavigate}
            >
              <Package />
              <span>{t("headerTop.trackOrder")}</span>
            </button>
            
            <button 
              className="mobile-nav-item"
              onClick={handleBlogNavigate}
            >
              <MessageSquare />
              <span>{t("headerTop.blog")}</span>
            </button>
            
            <button 
              className="mobile-nav-item"
              onClick={handleContactsNavigate}
            >
              <Mail />
              <span>{t("headerTop.contacts")}</span>
            </button>
          </nav>
          
          <div className="mobile-menu-divider"></div>
          
          <div className="mobile-user-section">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt={user.name || "User"} 
                        className="mobile-profile-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.mobile-profile-initial').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="mobile-profile-initial" style={{ display: profilePhoto ? 'none' : 'flex' }}>
                      {getInitial()}
                    </div>
                  </div>
                  <div className="mobile-user-details">
                    <div className="mobile-user-name">{user.name || "User"}</div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
                <button 
                  className="mobile-user-action"
                  onClick={handleProfileClick}
                >
                  <User />
                  <span>{t("headerTop.profile")}</span>
                </button>
                <button 
                  className="mobile-user-action logout"
                  onClick={handleLogoutClick}
                >
                  <LogOut />
                  <span>{t("headerTop.logout")}</span>
                </button>
              </>
            ) : (
              <button 
                className="mobile-login-btn"
                onClick={onLoginClick}
              >
                <img src={loginIcon} alt="" width="16" height="16" />
                <span>{t("headerTop.login")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-content">
          <a
            href="https://wa.me/996225325666"
            className="availability"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Contact us on WhatsApp"
          >
            <Phone />
            Available 24/7 at <strong>(225) 325 666</strong>
          </a>

          <nav className="top-nav" aria-label="Secondary navigation">
            <button 
              className="nav-link" 
              onClick={handleDeliveryNavigate}
              aria-label="Delivery and returns information"
            >
              <Truck />
              <span className="nav-link-text">{t("headerTop.delivery")}</span>
            </button>

            <button 
              className="nav-link" 
              onClick={handleTrackOrderNavigate}
              aria-label="Track your order"
            >
              <Package />
              <span className="nav-link-text">{t("headerTop.trackOrder")}</span>
            </button>

            <button 
              className="nav-link" 
              onClick={handleBlogNavigate}
              aria-label="Visit our blog"
            >
              <MessageSquare />
              <span className="nav-link-text">{t("headerTop.blog")}</span>
            </button>

            <button 
              className="nav-link" 
              onClick={handleContactsNavigate}
              aria-label="Contact us"
            >
              <Mail />
              <span className="nav-link-text">{t("headerTop.contacts")}</span>
            </button>
          </nav>

          <div className="top-actions">
            <div 
              className="language-selector"
              ref={langRef}
              aria-expanded={openLang}
            >
              

              {openLang && (
                <div 
                  className="lang-dropdown" 
                  id="lang-dropdown"
                  role="menu"
                >
                  <button
                    className="lang-option"
                    onClick={() => handleLanguageChange('en')}
                    role="menuitem"
                    aria-label="English"
                  >
                    <img 
                      src={america} 
                      alt="USA flag" 
                      className="flag-icon"
                      width={18}
                      height={12}
                    />
                    <span>English</span>
                  </button>
                  <button
                    className="lang-option"
                    onClick={() => handleLanguageChange('ru')}
                    role="menuitem"
                    aria-label="Russian"
                  >
                    <img 
                      src={russia} 
                      alt="Russian flag" 
                      className="flag-icon"
                      width={18}
                      height={12}
                    />
                    <span>Русский</span>
                  </button>
                </div>
              )}
            </div>

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
                {user && <ChevronDown className={`arrow-down ${openUserMenu ? 'rotate' : ''}`} />}
              </button>

              {user && openUserMenu && (
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
                    <User />
                    {t("headerTop.profile")}
                  </button>

                  <div className="dropdown-divider"></div>

                  <button
                    className="user-dropdown-item logout"
                    onClick={handleLogoutClick}
                    role="menuitem"
                    aria-label="Logout"
                  >
                    <LogOut />
                    {t("headerTop.logout")}
                  </button>
                </div>
              )}
            </div>

            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      <MobileMenu />
    </>
  );
}