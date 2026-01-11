import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FaHandPaper,
  FaBan,
  FaSoap,
  FaWind,
  FaStar,
  FaRegStar,
  FaShoppingCart
} from "react-icons/fa";
import "./ProductDetails.css";

/* ================= КОМПОНЕНТЫ УВЕДОМЛЕНИЙ ================= */

// 1. Уведомление "Added to Cart"
function CartAddedNotification({ isOpen, onClose, product, size, color, quantity, onViewCart }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItemsCount(cart.length);
    
    const total = cart.reduce((sum, item) => {
      const price = item.hasDiscount && item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
    setCartTotal(total.toFixed(2));

    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleViewCart = () => {
    if (onViewCart) onViewCart();
    handleClose();
  };

  const getColorHex = (colorName) => {
    const colors = {
      black: '#000000',
      white: '#ffffff',
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      pink: '#ec4899',
      gray: '#6b7280',
      brown: '#92400e',
      navy: '#1e3a8a',
    };
    return colors[colorName?.toLowerCase()] || '#6b7280';
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification cart-added ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <div className="notification-icon-circle">
            <span className="notification-icon">✓</span>
          </div>
          <div className="notification-titles">
            <h3 className="notification-title">Added to Cart</h3>
            <p className="notification-subtitle">Item successfully added to your shopping cart</p>
          </div>
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="notification-body">
          <div className="cart-product-preview">
            <div className="cart-product-image">
              <img 
                src={product.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                alt={product.name}
              />
            </div>
            <div className="cart-product-info">
              <h4 className="cart-product-name">{product.name}</h4>
              <div className="cart-product-details">
                {color && (
                  <span className="cart-product-color">
                    <span 
                      className="cart-color-dot" 
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    {color}
                  </span>
                )}
                {size && (
                  <span className="cart-product-size">
                    <span>Size:</span> {size}
                  </span>
                )}
              </div>
              <div className="cart-product-price">
                ${(product.price * quantity).toFixed(2)}
              </div>
            </div>
          </div>
          
          {cartItemsCount > 1 && (
            <div className="cart-summary">
              <div className="cart-count">
                <span className="cart-count-number">{cartItemsCount}</span>
                <span>items in cart</span>
              </div>
              <div className="cart-total-price">${cartTotal}</div>
            </div>
          )}
          
          <div className="notification-actions">
            <button className="notification-btn continue" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Continue Shopping
            </button>
            <button className="notification-btn view-cart" onClick={handleViewCart}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2H3.33333L5.2 9.592C5.30213 10.0251 5.59046 10.396 5.996 10.618C6.40153 10.84 6.8896 10.8927 7.33333 10.764H12.6667C13.1104 10.8927 13.5985 10.84 14.004 10.618C14.4095 10.396 14.6979 10.0251 14.8 9.592L16 4.66667H4.66667M6.66667 14C6.66667 14.3682 6.36819 14.6667 6 14.6667C5.63181 14.6667 5.33333 14.3682 5.33333 14C5.33333 13.6318 5.63181 13.3333 6 13.3333C6.36819 13.3333 6.66667 13.6318 6.66667 14ZM13.3333 14C13.3333 14.3682 13.0349 14.6667 12.6667 14.6667C12.2985 14.6667 12 14.3682 12 14C12 13.6318 12.2985 13.3333 12.6667 13.3333C13.0349 13.3333 13.3333 13.6318 13.3333 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Уведомление о выборе размера
function SizeWarningNotification({ isOpen, onClose, onSizeSelect }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
      setSelectedSize(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 400);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleConfirm = () => {
    if (selectedSize && onSizeSelect) {
      onSizeSelect(selectedSize);
    }
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification size-warning ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
          
          <div className="notification-icon-circle">
            <span className="notification-icon">⚠️</span>
          </div>
          
          <h3 className="notification-title">Select a Size</h3>
          <p className="notification-subtitle">
            Please choose your size before adding to cart
          </p>
        </div>
        
        <div className="notification-body size-selector-body">
          <p style={{ marginBottom: '20px', color: '#64748b' }}>
            Available sizes for this product:
          </p>
          
          <div className="size-options">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
          
          <div className="notification-actions">
            <button className="notification-btn cancel" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cancel
            </button>
            <button 
              className="notification-btn primary" 
              onClick={handleConfirm}
              disabled={!selectedSize}
              style={{ opacity: selectedSize ? 1 : 0.6 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3333 4L5.99996 11.3333L2.66663 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Confirm Size
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Уведомление о добавлении в избранное
function FavoriteAddedNotification({ isOpen, onClose, product }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification favorite-added ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
          
          <div className="notification-icon-circle">
            <span className="notification-icon">❤️</span>
          </div>
          
          <h3 className="notification-title">Added to Favorites</h3>
          <p className="notification-subtitle">
            Item successfully added to your wishlist
          </p>
        </div>
        
        <div className="notification-body">
          {product && (
            <div className="favorite-product-info">
              <div className="favorite-product-image">
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop"} 
                  alt={product.name}
                />
              </div>
              <div className="favorite-product-details">
                <h4 className="favorite-product-name">{product.name}</h4>
                <p className="favorite-product-price">${product.price?.toFixed(2)}</p>
              </div>
            </div>
          )}
          
          <div className="notification-actions">
            <button className="notification-btn cancel" onClick={handleClose}>
              Continue Shopping
            </button>
            <button className="notification-btn primary" onClick={handleClose}>
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ФУНКЦИИ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ================= */

const addToCart = (product, size, color, quantity = 1, imageUrl) => {
  const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const cartItemId = Date.now();
  
  const item = {
    id: cartItemId,
    productId: product.id,
    name: product.name,
    price: product.price,
    basePrice: product.basePrice || product.price,
    discount: product.discount || 0,
    hasDiscount: product.hasDiscount || false,
    size: size,
    quantity: quantity,
    color: color,
    imageUrl: imageUrl || product.avatar || product.avatarred || "",
    variant: product.variant || product.kategory || "",
    timestamp: Date.now()
  };
  
  const existingItemIndex = existingCart.findIndex(cartItem => 
    cartItem.productId === item.productId && 
    cartItem.size === item.size && 
    cartItem.color === item.color
  );
  
  if (existingItemIndex !== -1) {
    existingCart[existingItemIndex].quantity += quantity;
  } else {
    existingCart.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(existingCart));
  window.dispatchEvent(new Event('cartUpdated'));
  
  return item;
};

const addToFavorites = (product, color, imageUrl) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  const favoriteItem = {
    id: Date.now(),
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: imageUrl,
    color: color,
    timestamp: Date.now()
  };

  const isAlreadyFavorite = favorites.some(fav => 
    fav.productId === favoriteItem.productId && 
    fav.color === favoriteItem.color
  );
  
  if (!isAlreadyFavorite) {
    favorites.push(favoriteItem);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
    return { success: true, item: favoriteItem };
  } else {
    const updatedFavorites = favorites.filter(fav => 
      !(fav.productId === favoriteItem.productId && fav.color === favoriteItem.color)
    );
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
    return { success: false, item: favoriteItem };
  }
};

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Состояния для уведомлений
  const [showCartAdded, setShowCartAdded] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showFavoriteAdded, setShowFavoriteAdded] = useState(false);
  
  // Данные для уведомлений
  const [cartNotificationData, setCartNotificationData] = useState(null);
  const [favoriteNotificationData, setFavoriteNotificationData] = useState(null);

  useEffect(() => {
    fetch(`https://691bbd103aaeed735c8e1d0d.mockapi.io/my/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const basePrice = Number(data.price.replace("$", ""));
        const discount = data.sale ? Number(data.sale) : null;
        const price = discount
          ? +(basePrice * (1 - discount / 100)).toFixed(2)
          : basePrice;

        setProduct({
          ...data,
          basePrice,
          price,
          discount,
          hasDiscount: !!data.sale,
        });
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!product) return <div className="error-state">Product not found</div>;

  return (
    <div className="product-page-wrapper">
      <div className="container">
        <h2 className="main-details-title">Details</h2>
        <Content 
          product={product} 
          onAddToCartNotification={(data) => {
            setCartNotificationData(data);
            setShowCartAdded(true);
          }}
          onSizeWarning={() => setShowSizeWarning(true)}
          onFavoriteAdded={(data) => {
            setFavoriteNotificationData(data);
            setShowFavoriteAdded(true);
          }}
        />
        
        {/* УВЕДОМЛЕНИЯ */}
        {showCartAdded && cartNotificationData && (
          <CartAddedNotification
            isOpen={showCartAdded}
            onClose={() => setShowCartAdded(false)}
            product={cartNotificationData.product}
            size={cartNotificationData.size}
            color={cartNotificationData.color}
            quantity={cartNotificationData.quantity}
          />
        )}

        <SizeWarningNotification
          isOpen={showSizeWarning}
          onClose={() => setShowSizeWarning(false)}
          onSizeSelect={(selectedSize) => {
            // Обработчик выбора размера из уведомления
            if (product) {
              const colorMap = [
                { name: "black", label: "Black", src: product.avatar },
                { name: "white", label: "White", src: product.avatarwhite },
                { name: "blue", label: "Blue", src: product.avatarblue },
                { name: "red", label: "Red", src: product.avatarred },
              ].filter((c) => c.src);
              
              const activeColor = colorMap[0]?.label || "Black";
              const activeImage = colorMap[0]?.src || product.avatar;
              
              const addedItem = addToCart(product, selectedSize, activeColor, 1, activeImage);
              
              setCartNotificationData({
                product: {
                  ...product,
                  imageUrl: activeImage
                },
                size: selectedSize,
                color: activeColor,
                quantity: 1
              });
              setShowCartAdded(true);
            }
          }}
        />

        {showFavoriteAdded && favoriteNotificationData && (
          <FavoriteAddedNotification
            isOpen={showFavoriteAdded}
            onClose={() => setShowFavoriteAdded(false)}
            product={favoriteNotificationData.product}
          />
        )}
      </div>
    </div>
  );
}

function Content({ product, onAddToCartNotification, onSizeWarning, onFavoriteAdded }) {
  // Формируем список доступных цветов
  const colorMap = useMemo(() => {
    return [
      { name: "black", label: "Black", src: product.avatar },
      { name: "white", label: "White", src: product.avatarwhite },
      { name: "blue", label: "Blue", src: product.avatarblue },
      { name: "red", label: "Red", src: product.avatarred },
    ].filter((c) => c.src);
  }, [product]);

  // Массив для слайдера: [Клон последнего, Оригиналы..., Клон первого]
  const slides = useMemo(() => {
    if (!colorMap.length) return [];
    const images = colorMap.map((c) => c.src);
    return [images[images.length - 1], ...images, images[0]];
  }, [colorMap]);

  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSize, setActiveSize] = useState("");
  const [rating, setRating] = useState(4);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Проверяем, есть ли товар в избранном
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const activeColorName = getActiveColorName();
    const isFav = favorites.some(fav => 
      fav.productId === product.id && 
      fav.color === activeColorName
    );
    setIsFavorite(isFav);
  }, [product.id, index]);

  // Определяем активный цвет для подсветки точек
  const getActiveColorName = () => {
    if (index === 0) return colorMap[colorMap.length - 1]?.label;
    if (index === slides.length - 1) return colorMap[0]?.label;
    return colorMap[index - 1]?.label;
  };

  const activeColorName = getActiveColorName();

  // ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ
  const handleSlideChange = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(newIndex);
  };

  const onTransitionEnd = () => {
    setIsAnimating(false);
    
    // Если дошли до левого края (клон последнего фото)
    if (index === 0) {
      setIndex(slides.length - 2);
    }
    // Если дошли до правого края (клон первого фото)
    if (index === slides.length - 1) {
      setIndex(1);
    }
  };

  const handleAddToCart = () => {
    if (!activeSize) {
      onSizeWarning();
      return;
    }

    const activeImage = colorMap[index - 1]?.src || product.avatar;
    const addedItem = addToCart(product, activeSize, activeColorName, quantity, activeImage);
    
    onAddToCartNotification({
      product: {
        ...product,
        imageUrl: activeImage
      },
      size: activeSize,
      color: activeColorName,
      quantity: quantity
    });
  };

  const handleFavoriteClick = () => {
    const activeImage = colorMap[index - 1]?.src || product.avatar;
    const result = addToFavorites(product, activeColorName, activeImage);
    
    setIsFavorite(result.success);
    
    if (result.success) {
      onFavoriteAdded({
        product: {
          ...product,
          imageUrl: activeImage
        }
      });
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="product-layout">
      {/* ЛЕВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
      <div className="text-info-column">
        <p className="intro-text">
          Experience premium comfort and legendary style. 
          Designed for durability and everyday wear.
        </p>

        <section className="info-block">
          <h4 className="info-subtitle">Details</h4>
          <ul className="info-list">
            <li><strong>Brand:</strong> {product.brand || "Jordan"}</li>
            <li>Mid-cut design</li>
            <li>Lace-up fastening</li>
            <li>Rubber outside pods</li>
          </ul>
        </section>

        <hr className="divider" />

        <section className="info-block">
          <h4 className="info-subtitle">Fabric</h4>
          <ul className="info-list">
            <li><strong>Upper:</strong> 50% leather, 50% textile</li>
            <li><strong>Sole:</strong> 100% rubber</li>
          </ul>
        </section>

        <hr className="divider" />

        <section className="info-block">
          <h4 className="info-subtitle">Care</h4>
          <ul className="info-list care-list">
            <li><FaHandPaper /> Hand wash only</li>
            <li><FaBan /> No ironing</li>
            <li><FaSoap /> No bleach</li>
            <li><FaWind /> No tumble dry</li>
          </ul>
        </section>
      </div>

      {/* ПРАВАЯ КОЛОНКА: СЛАЙДЕР И КАРТОЧКА */}
      <div className="sticky-card-column">
        <div className="card-exact">
          <div className="image-wrapper-exact">
            {product.hasDiscount && (
              <div className="badge-exact">-{product.discount}%</div>
            )}

            <div className="rating-exact">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star-icon ${i < rating ? "filled" : "empty"}`}
                  onClick={() => setRating(i + 1)}
                >
                  {i < rating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>

            <div className="img-container viewport">
              {/* ЛЕВАЯ КНОПКА */}
              <button 
                className="slider-btn left" 
                onClick={() => handleSlideChange(index - 1)}
              >
                ‹
              </button>

              <div
                className="slider-track-details"
                style={{
                  transform: `translateX(-${index * 100}%)`,
                  transition: isAnimating ? "transform 0.45s ease-out" : "none",
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {slides.map((img, i) => (
                  <img key={i} src={img} className="image-exact slide-img" alt="" />
                ))}
              </div>

              {/* ПРАВАЯ КНОПКА */}
              <button 
                className="slider-btn right" 
                onClick={() => handleSlideChange(index + 1)}
              >
                ›
              </button>
            </div>

            <button 
              className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          </div>

          <div className="card-body-exact">
            <p className="category-text">{product.kategory}</p>
            <h4 className="title-text">{product.name}</h4>

            <div className="price-row">
              <span className="price-current">${product.price.toFixed(2)}</span>
              {product.hasDiscount && (
                <span className="price-old">${product.basePrice.toFixed(2)}</span>
              )}
            </div>

            <div className="selection-area">
              <div className="selector-group">
                <label className="selector-label">Size:</label>
                <div className="sizes-block">
                  {["XS", "S", "M", "L", "XL"].map((s) => (
                    <span
                      key={s}
                      className={`size-option ${activeSize === s ? "active" : ""}`}
                      onClick={() => setActiveSize(s)}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {!activeSize && (
                  <p className="size-warning-text">Please select a size</p>
                )}
              </div>

              <div className="selector-group">
                <label className="selector-label">Color:</label>
                <div className="colors-block">
                  {colorMap.map((color, i) => (
                    <span
                      key={color.name}
                      className={`dot d-${color.name} ${
                        activeColorName === color.label ? "active" : ""
                      }`}
                      onClick={() => handleSlideChange(i + 1)}
                      title={color.label}
                    />
                  ))}
                </div>
                {activeColorName && (
                  <p className="selected-color-text">Selected: {activeColorName}</p>
                )}
              </div>

              <button className="add-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}