import createxLogo from "../../assets/CREATEX.png";
import searchIcon from "../../assets/lupa.png";
import heartIcon from "../../assets/jurok.png";
import cartIcon from "../../assets/Cart.png";
import "./header-main.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { FiMenu, FiX } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HeaderMain({
  activeMenu,
  onMenuToggle,
  onCartClick,
  onFavoriteClick
}) {
  const { t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`https://691bbd103aaeed735c8e1d0d.mockapi.io/my`);
        const products = await response.json();
        setAllProducts(products);
        
        const popularCategories = [...new Set(products.map(p => p.kategory))].slice(0, 5);
        setPopularSearches(popularCategories);
        
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(savedSearches.slice(0, 5));
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const loadCartCount = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
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

    loadCartCount();
    loadFavoritesCount();

    const handleCartUpdate = () => loadCartCount();
    const handleFavoritesUpdate = () => loadFavoritesCount();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.burger-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const performSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      
      // Ищем товары по названию и категории
      const results = allProducts.filter(product => {
        const searchLower = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          (product.kategory && product.kategory.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      }).slice(0, 8); // Ограничиваем до 8 результатов для подсказок

      setSearchResults(results);
      setShowSuggestions(true);
      setIsSearching(false);
    }, 300),
    [allProducts]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    saveToRecentSearches(searchQuery);
    
    // Ищем точное совпадение
    const exactMatch = allProducts.find(product => 
      product.name.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (exactMatch) {
      navigateToProduct(exactMatch);
    } else if (searchResults.length === 1) {
      navigateToProduct(searchResults[0]);
    } else if (searchResults.length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length >= 1) {
      performSearch(value);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(true);
    }
  };

  const saveToRecentSearches = (query) => {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const filtered = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    filtered.unshift(query);
    localStorage.setItem('recentSearches', JSON.stringify(filtered.slice(0, 10)));
    setRecentSearches(filtered.slice(0, 5));
  };

  const navigateToProduct = (product) => {
    let productRoute = `/product/${product.id}`;
    
    if (product.kategory && product.kategory.toLowerCase().includes('men')) {
      productRoute = `/men/product/${product.id}`;
    } else if (product.kategory && product.kategory.toLowerCase().includes('kids')) {
      productRoute = `/kids/product/${product.id}`;
    }
    
    navigate(productRoute);
    setSearchQuery("");
    setShowSuggestions(false);
    saveToRecentSearches(product.name);
    setIsMobileMenuOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
  };

  const handlePopularSearchClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    performSearch(searchTerm);
  };

  const handleRecentSearchClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    performSearch(searchTerm);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = (item) => {
    onMenuToggle(item);
    setIsMobileMenuOpen(false);
  };

  const menuItems = ["women", "men", "girls", "boys", "sale"];
  const menuLabelKey = (item) => {
    switch (item) {
      case "women":
        return "headerMain.women";
      case "men":
        return "headerMain.men";
      case "girls":
        return "headerMain.girls";
      case "boys":
        return "headerMain.boys";
      case "sale":
        return "headerMain.sale";
      default:
        return item;
    }
  };

  return (
    <>
      <div className="main-header">
        <div className="container main-header-content">
          {isMobile && (
            <button className="burger-menu-btn" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}

          <a href="/" className="logo">
            <img src={createxLogo} alt="Createx" />
          </a>

          {!isMobile && (
            <nav className="main-nav">
              {menuItems.map((item) => (
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
                  {t(menuLabelKey(item))}
                </a>
              ))}
            </nav>
          )}

          <div className="search-container" ref={searchContainerRef}>
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <input 
                placeholder={t("headerMain.searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                autoComplete="off"
              />
              <button type="submit" disabled={isSearching}>
                <img src={searchIcon} alt="Search" />
                {isSearching && <span className="search-spinner"></span>}
              </button>
            </form>

            {showSuggestions && (
              <div className="search-suggestions">
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="suggestions-section">
                    <div className="section-header">
                      <span>{t("headerMain.products")}</span>
                      <span className="count">
                        {searchResults.length} {t("headerMain.found")}
                      </span>
                    </div>
                    <div className="suggestions-list">
                      {searchResults.map((product) => {
                        const price = product.sale 
                          ? (Number(product.price.replace("$", "")) * (1 - product.sale / 100)).toFixed(2)
                          : Number(product.price.replace("$", "")).toFixed(2);
                        
                        return (
                          <div 
                            key={product.id} 
                            className="suggestion-item product-suggestion"
                            onClick={() => navigateToProduct(product)}
                          >
                            <div className="suggestion-image">
                              <img 
                                src={product.avatarred || product.avatar || product.avatarwhite} 
                                alt={product.name}
                              />
                            </div>
                            <div className="suggestion-info">
                              <h4>{product.name}</h4>
                              <p className="suggestion-category">{product.kategory || "Clothing"}</p>
                              <div className="suggestion-price">
                                <span className="current">${price}</span>
                                {product.sale && (
                                  <span className="original">
                                    ${Number(product.price.replace("$", "")).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {searchQuery.trim() && allProducts.length > 0 && (
                  <div className="suggestions-section">
                    <div className="section-header">
                      <span>{t("headerMain.suggestions")}</span>
                    </div>
                    <div className="suggestions-list">
                      {allProducts
                        .filter(product => 
                          product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((product, index) => (
                          <div 
                            key={index} 
                            className="suggestion-item text-suggestion"
                            onClick={() => handleSuggestionClick(product.name)}
                          >
                            <span className="suggestion-icon">🔍</span>
                            <span className="suggestion-text">
                              {product.name}
                              <span className="suggestion-hint">
                                {" "}
                                - {t("headerMain.inPrefix")} {product.kategory || "Clothing"}
                              </span>
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {!searchQuery.trim() && recentSearches.length > 0 && (
                  <div className="suggestions-section">
                    <div className="section-header">
                      <span>{t("headerMain.recentSearches")}</span>
                      <button 
                        className="clear-recent" 
                        onClick={clearRecentSearches}
                        title={t("headerMain.clearAll")}
                      >
                        {t("headerMain.clear")}
                      </button>
                    </div>
                    <div className="suggestions-list">
                      {recentSearches.map((search, index) => (
                        <div 
                          key={index} 
                          className="suggestion-item recent-search"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <span className="suggestion-icon">🕒</span>
                          <span className="suggestion-text">{search}</span>
                          <button 
                            className="remove-search" 
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = recentSearches.filter((_, i) => i !== index);
                              localStorage.setItem('recentSearches', JSON.stringify(updated));
                              setRecentSearches(updated);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!searchQuery.trim() && popularSearches.length > 0 && (
                  <div className="suggestions-section">
                    <div className="section-header">
                      <span>{t("headerMain.popularCategories")}</span>
                    </div>
                    <div className="suggestions-list">
                      {popularSearches.map((category, index) => (
                        <div 
                          key={index} 
                          className="suggestion-item popular-search"
                          onClick={() => handlePopularSearchClick(category)}
                        >
                          <span className="suggestion-icon">🔥</span>
                          <span className="suggestion-text">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="no-suggestions">
                    <p>
                      {t("headerMain.noProductsFoundPrefix")} "{searchQuery}"
                    </p>
                    <p className="try-suggestions">{t("headerMain.tryDifferentKeywords")}</p>
                  </div>
                )}

                {/* Ссылка на все результаты */}
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div 
                    className="view-all-link"
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <span>View all results for "{searchQuery}"</span>
                    <span className="arrow">→</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="user-icons">
            <button className="icon-btn" onClick={onFavoriteClick}>
              <img src={heartIcon} alt="Favorites" />
              <span className={`counter ${favoritesCount > 0 ? 'has-items' : ''}`}>
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            </button>

            <button className="icon-btn" onClick={onCartClick}>
              <img src={cartIcon} alt="Cart" />
              <span className={`counter green ${cartCount > 0 ? 'has-items' : ''}`}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню (только для мобильных) */}
      {isMobile && (
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-container" ref={mobileMenuRef}>
            <div className="mobile-menu-header">
              <a href="/" className="mobile-menu-logo">
                <img src={createxLogo} alt="Createx" />
              </a>
              <button className="mobile-menu-close" onClick={toggleMobileMenu}>
                <FiX size={24} />
              </button>
            </div>
            
            <nav className="mobile-menu-nav">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`mobile-menu-item ${item === "sale" ? "sale-link" : ""} ${
                    activeMenu === item ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuItemClick(item);
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="mobile-menu-arrow">→</span>
                </a>
              ))}
            </nav>
            
            <div className="mobile-menu-footer">
              <div className="mobile-menu-actions">
                <button className="mobile-menu-action" onClick={onFavoriteClick}>
                  <img src={heartIcon} alt="Favorites" />
                  <span>Favorites</span>
                  <span className="mobile-menu-count">{favoritesCount}</span>
                </button>
                
                <button className="mobile-menu-action" onClick={onCartClick}>
                  <img src={cartIcon} alt="Cart" />
                  <span>Cart</span>
                  <span className="mobile-menu-count">{cartCount}</span>
                </button>
              </div>
              
              <div className="mobile-menu-search">
                <form className="mobile-search-box" onSubmit={handleSearchSubmit}>
                  <input 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete="off"
                  />
                  <button type="submit">
                    <img src={searchIcon} alt="Search" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}