import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "./product.css";
import { KidsProductDetails } from "./KidsProductDetails"; 
import KidsReviews from "./KidsReviews";

// Иконки
import favoriteIcon from "../../assets/favorite.png";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import pinterest from "../../assets/pinterest.png";
import visa from "../../assets/visa.png";
import mastercard from "../../assets/master-card.png";
import paypal from "../../assets/pay-pal.png";
import { FaTimes, FaCreditCard, FaLock, FaShieldAlt, FaCheck, FaFacebook, FaTwitter, FaPinterest, FaLink, FaCopy } from "react-icons/fa";

/* ================= TOGGLE COMPONENT ================= */
function InfoToggle({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="info-toggle">
      <div className="info-toggle-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="toggle">{open ? "−" : "+"}</span>
      </div>
      {open && <div className="info-toggle-content">{children}</div>}
    </div>
  );
}

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
                {quantity > 1 && (
                  <span className="cart-product-qty">
                    <span>Qty:</span> {quantity}
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

// 3. Уведомление об удалении из избранного
function FavoriteRemovedNotification({ isOpen, onClose, onUndo, product }) {
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

  const handleUndo = () => {
    if (onUndo) onUndo();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <div className={`notification favorite-removed ${isHiding ? 'hiding' : ''}`}>
        <div className="notification-progress">
          <div className="notification-progress-bar"></div>
        </div>
        
        <div className="notification-header">
          <button className="notification-close-btn" onClick={handleClose}>
            ×
          </button>
          
          <div className="notification-icon-circle">
            <span className="notification-icon">💔</span>
          </div>
          
          <h3 className="notification-title">Removed from Favorites</h3>
          <p className="notification-subtitle">
            Item has been removed from your wishlist
          </p>
        </div>
        
        <div className="notification-body favorite-removed-body">
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
          
          <div className="undo-action">
            <button className="undo-btn" onClick={handleUndo}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.33337 8.00008C1.33337 11.6761 4.32404 14.6667 8.00004 14.6667C11.676 14.6667 14.6667 11.6761 14.6667 8.00008C14.6667 4.32408 11.676 1.33341 8.00004 1.33341C5.06404 1.33341 2.57871 3.08941 1.69204 5.66675M1.33337 3.33341V5.66675H3.66671" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Undo
            </button>
          </div>
          
          <div className="notification-actions" style={{ marginTop: '24px' }}>
            <button className="notification-btn cancel" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6L6 10M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Close
            </button>
            <button className="notification-btn primary" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2H3.33333L5.2 9.592C5.30213 10.0251 5.59046 10.396 5.996 10.618C6.40153 10.84 6.8896 10.8927 7.33333 10.764H12.6667C13.1104 10.8927 13.5985 10.84 14.004 10.618C14.4095 10.396 14.6979 10.0251 14.8 9.592L16 4.66667H4.66667M6.66667 14C6.66667 14.3682 6.36819 14.6667 6 14.6667C5.63181 14.6667 5.33333 14.3682 5.33333 14C5.33333 13.6318 5.63181 13.3333 6 13.3333C6.36819 13.3333 6.66667 13.6318 6.66667 14ZM13.3333 14C13.3333 14.3682 13.0349 14.6667 12.6667 14.6667C12.2985 14.6667 12 14.3682 12 14C12 13.6318 12.2985 13.3333 12.6667 13.3333C13.0349 13.3333 13.3333 13.6318 13.3333 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Similar Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Уведомление о добавлении в избранное
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
    imageUrl: imageUrl || product.avatar || product.avatargreen || "",
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

/* ================= ОТДЕЛЬНЫЙ КОМПОНЕНТ PAYMENT MODAL ================= */
function PaymentModalComponent({ paymentType, product, onClose }) {
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const paymentInfo = {
    visa: { name: "Visa", color: "#1a1f71", icon: "💳" },
    mastercard: { name: "Mastercard", color: "#eb001b", icon: "💳" },
    paypal: { name: "PayPal", color: "#003087", icon: "🏦" }
  };

  const info = paymentInfo[paymentType] || paymentInfo.visa;

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => onClose(), 3000);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal payment-modal success">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h2>Payment Successful! ✅</h2>
          <div className="success-details">
            <p><strong>Product:</strong> {product.name}</p>
            <p><strong>Amount:</strong> ${product.price.toFixed(2)}</p>
            <p><strong>Method:</strong> {info.name}</p>
          </div>
          <p className="success-message">
            Order confirmed. Email confirmation sent.
          </p>
          <button className="close-success-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal payment-modal">
        <div className="modal-header" style={{ background: info.color }}>
          <div className="modal-title">
            <span className="modal-icon">{info.icon}</span>
            <h2>Pay with {info.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="payment-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <span>Details</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <span>Payment</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <span>Confirm</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {step === 1 && (
            <div className="form-step">
              <h3>Order Summary</h3>
              <div className="order-summary">
                <div className="order-item">
                  <span>{product.name}</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="order-total">
                  <strong>Total</strong>
                  <strong>${product.price.toFixed(2)}</strong>
                </div>
              </div>
              <button type="button" className="next-btn" onClick={() => setStep(2)}>
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && paymentType !== 'paypal' && (
            <div className="form-step">
              <h3>Card Details</h3>
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <FaCreditCard />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <div className="input-with-icon">
                      <FaLock />
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>
              </div>
              <div className="step-buttons">
                <button type="button" className="back-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="button" className="next-btn" onClick={() => setStep(3)}>
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 2 && paymentType === 'paypal' && (
            <div className="form-step">
              <h3>PayPal</h3>
              <div className="paypal-flow">
                <p>You will be redirected to PayPal to complete your payment securely.</p>
                <button type="button" className="paypal-btn" onClick={() => setStep(3)}>
                  Continue to PayPal
                </button>
              </div>
              <button type="button" className="back-btn" onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3>Confirm Payment</h3>
              <div className="confirmation-details">
                <div className="detail-row">
                  <span>Product:</span>
                  <span>{product.name}</span>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span>Method:</span>
                  <span>{info.name}</span>
                </div>
              </div>
              <div className="step-buttons">
                <button type="button" className="back-btn" onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="submit" className="submit-btn" disabled={processing}>
                  {processing ? "Processing..." : `Pay $${product.price.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ================= ОТДЕЛЬНЫЙ КОМПОНЕНТ SOCIAL SHARE MODAL ================= */
function SocialShareModalComponent({ socialType, product, onClose }) {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(`Check out this ${product.name}!`);
  
  const shareUrl = window.location.href;
  const productImage = product.avatar || product.avatargreen;

  const socialInfo = {
    facebook: {
      name: "Facebook",
      color: "#1877F2",
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`
    },
    twitter: {
      name: "Twitter",
      color: "#1DA1F2",
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`
    },
    pinterest: {
      name: "Pinterest",
      color: "#E60023",
      icon: <FaPinterest />,
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(message)}`
    }
  };

  const info = socialInfo[socialType] || socialInfo.facebook;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    window.open(info.url, '_blank', 'width=600,height=400');
    setTimeout(onClose, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal social-modal">
        <div className="modal-header" style={{ background: info.color }}>
          <div className="modal-title">
            <span className="modal-icon">{info.icon}</span>
            <h2>Share on {info.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="social-content">
          <div className="product-preview">
            <img src={productImage} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="message-editor">
            <label>Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength="280"
              rows="3"
            />
          </div>

          <div className="link-section">
            <label>Product Link</label>
            <div className="link-container">
              <FaLink />
              <input type="text" value={shareUrl} readOnly />
              <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>
                <FaCopy /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="share-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="share-btn" style={{ background: info.color }} onClick={handleShare}>
              {info.icon} Share on {info.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PRODUCT PAGE COMPONENT ================= */
export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  
  // Состояния для модальных окон
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState("");

  // Состояния для уведомлений
  const [showCartAdded, setShowCartAdded] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showFavoriteAdded, setShowFavoriteAdded] = useState(false);
  const [showFavoriteRemoved, setShowFavoriteRemoved] = useState(false);
  
  // Данные для уведомлений
  const [cartNotificationData, setCartNotificationData] = useState(null);
  const [favoriteNotificationData, setFavoriteNotificationData] = useState(null);
  const [lastFavoriteItem, setLastFavoriteItem] = useState(null);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    fetch(`https://6947cef21ee66d04a44dfb36.mockapi.io/kids/${id}`)
      .then(res => res.json())
      .then(data => {
        const basePrice = Number(data.price.replace("$", ""));
        const discount = data.sale ? Number(data.sale) : null;
        const price = discount
          ? +(basePrice * (1 - discount / 100)).toFixed(2)
          : basePrice;

        const productData = {
          ...data,
          basePrice,
          price,
          discount,
          hasDiscount: !!data.sale 
        };
        
        setProduct(productData);
        
        // Инициализируем изображения сразу после загрузки продукта
        const productImages = [
          productData.avatargreen,
          productData.avatar,
          productData.avatarwhite,
          productData.avatarblue,
          productData.avatargreen,
          productData.avatar
        ].filter(Boolean);
        
        setImages(productImages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading product:', error);
        setLoading(false);
      });
  }, [id]);

  // Функция для получения цвета по индексу
  const getColorFromIndex = (idx) => {
    switch(idx) {
      case 0: return "Green";
      case 1: return "Black";
      case 2: return "White";
      case 3: return "Blue";
      default: return "Green";
    }
  };

  // Обновляем выбранный цвет при изменении индекса
  useEffect(() => {
    if (images.length > 0) {
      const realIndex = index === 0
        ? images.length - 3
        : index === images.length - 1
        ? 0
        : index - 1;
      
      const color = getColorFromIndex(realIndex);
      setSelectedColor(color);
    }
  }, [index, images]);

  const goToSlide = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(newIndex);
  };

  const next = () => goToSlide(index + 1);
  const prev = () => goToSlide(index - 1);

  const onTransitionEnd = () => {
    setIsAnimating(false);
    if (images.length > 0) {
      if (index === images.length - 1) setIndex(1);
      if (index === 0) setIndex(images.length - 2);
    }
  };

  /* ================= HANDLERS ================= */
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!size) {
      setShowSizeWarning(true);
      return;
    }

    const realIndex = index === 0
      ? images.length - 3
      : index === images.length - 1
      ? 0
      : index - 1;
      
    const color = getColorFromIndex(realIndex);
    const imageUrl = images[realIndex] || product.avatargreen;
    
    const addedItem = addToCart(product, size, color, quantity, imageUrl);
    
    // Показываем уведомление о добавлении в корзину
    setCartNotificationData({
      product: {
        ...product,
        imageUrl: imageUrl
      },
      size: size,
      color: color,
      quantity: quantity
    });
    setShowCartAdded(true);
  };

  const handleAddToFavorites = () => {
    if (!product) return;
    
    const realIndex = index === 0
      ? images.length - 3
      : index === images.length - 1
      ? 0
      : index - 1;
      
    const color = getColorFromIndex(realIndex);
    const imageUrl = images[realIndex] || product.avatargreen;
    
    const result = addToFavorites(product, color, imageUrl);
    
    setLastFavoriteItem(result.item);
    
    if (result.success) {
      // Показываем уведомление о добавлении в избранное
      setFavoriteNotificationData({
        product: {
          ...product,
          imageUrl: imageUrl
        }
      });
      setShowFavoriteAdded(true);
    } else {
      // Показываем уведомление об удалении из избранного
      setFavoriteNotificationData({
        product: {
          ...product,
          imageUrl: imageUrl
        }
      });
      setShowFavoriteRemoved(true);
    }
  };

  const handlePaymentClick = (paymentType) => {
    setSelectedPayment(paymentType);
    setShowPaymentModal(true);
  };

  const handleSocialClick = (socialType) => {
    setSelectedSocial(socialType);
    setShowSocialModal(true);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Функция для обработки клика по цвету
  const handleColorClick = (colorName, slideIndex) => {
    goToSlide(slideIndex);
    setSelectedColor(colorName);
  };

  // Обработчик выбора размера из уведомления
  const handleSizeSelectFromNotification = (selectedSize) => {
    setSize(selectedSize);
    
    // Автоматически добавляем в корзину после выбора размера
    setTimeout(() => {
      const realIndex = index === 0
        ? images.length - 3
        : index === images.length - 1
        ? 0
        : index - 1;
        
      const color = getColorFromIndex(realIndex);
      const imageUrl = images[realIndex] || product.avatargreen;
      
      const addedItem = addToCart(product, selectedSize, color, quantity, imageUrl);
      
      // Показываем уведомление о добавлении в корзину
      setCartNotificationData({
        product: {
          ...product,
          imageUrl: imageUrl
        },
        size: selectedSize,
        color: color,
        quantity: quantity
      });
      setShowCartAdded(true);
    }, 300);
  };

  // Обработчик отмены удаления из избранного
  const handleUndoRemoveFavorite = () => {
    if (lastFavoriteItem) {
      // Добавляем обратно в избранное
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      favorites.push(lastFavoriteItem);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      // Показываем уведомление о добавлении в избранное
      setFavoriteNotificationData({
        product: {
          ...product,
          imageUrl: lastFavoriteItem.imageUrl
        }
      });
      setShowFavoriteAdded(true);
    }
  };

  // Обработчик открытия корзины
  const handleViewCart = () => {
    // Здесь можно добавить логику открытия корзины
    console.log("Opening cart...");
    // Например: window.dispatchEvent(new Event('openCart'));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  // Рассчитываем realIndex для отображения
  const realIndex = images.length > 0
    ? index === 0
      ? images.length - 3
      : index === images.length - 1
      ? 0
      : index - 1
    : 0;

  return (
    <div className="product-wrapper">
      {/* HEADER */}
      <div className="product-header">
        <h1>{product.name}</h1>
        <span className="sku">Art. No. {product.id}</span>
      </div>

      {/* TABS NAVIGATION */}
      <div className="product-tabs">
        <button
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          General info
        </button>
        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Product details
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews <span>12</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="tab-content">
        
        {/* 1. GENERAL INFO */}
        {activeTab === "info" && (
          <div className="product-page">
            {/* LEFT - SLIDER */}
            <div className="image-card">
              {images.length > 0 ? (
                <>
                  <div className="slider">
                    <div
                      className="slider-track"
                      style={{
                        transform: `translateX(-${index * 100}%)`,
                        transition: isAnimating ? "transform .45s ease" : "none"
                      }}
                      onTransitionEnd={onTransitionEnd}
                    >
                      {images.map((img, i) => (
                        <div className="slide" key={i}>
                          <img src={img} alt={`${product.name} - view ${i+1}`} />
                        </div>
                      ))}
                    </div>
                    <button className="nav left" onClick={prev}>‹</button>
                    <button className="nav right" onClick={next}>›</button>
                  </div>

                  <div className="thumbs">
                    {images.slice(1, -1).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className={realIndex === i ? "active" : ""}
                        onClick={() => goToSlide(i + 1)}
                        alt={`Thumbnail ${i+1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-images">No images available</div>
              )}
            </div>

            {/* RIGHT - PURCHASE INFO */}
            <div className="info-box">
              <div className="price-row">
                <span className="price">${product.price.toFixed(2)}</span>
                {product.hasDiscount && (
                  <>
                    <span className="old">${product.basePrice.toFixed(2)}</span>
                    <span className="sale">-{product.discount}%</span>
                  </>
                )}
              </div>

              <div className="block">
                <label>Color</label>
                <div className="colors">
                  <span 
                    className={`color black ${realIndex === 0 ? "active" : ""}`} 
                    onClick={() => handleColorClick("Black", 1)} 
                    title="Black color"
                  />
                  <span 
                    className={`color white ${realIndex === 1 ? "active" : ""}`} 
                    onClick={() => handleColorClick("White", 2)} 
                    title="White color"
                  />
                  <span 
                    className={`color blue ${realIndex === 2 ? "active" : ""}`} 
                    onClick={() => handleColorClick("Blue", 3)} 
                    title="Blue color"
                  />
                  <span 
                    className={`color green ${realIndex === 3 ? "active" : ""}`} 
                    onClick={() => handleColorClick("Green", 4)} 
                    title="Green color"
                  />
                </div>
                {selectedColor && (
                  <p className="selected-color-text">Selected: {selectedColor}</p>
                )}
              </div>

              <div className="block">
                <label>Size</label>
                <select 
                  value={size} 
                  onChange={e => setSize(e.target.value)}
                  className="size-select"
                >
                  <option value="">Please select</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              <div className="block">
                <label>Quantity</label>
                <div className="quantity-selector">
                  <button 
                    className="qty-btn minus" 
                    onClick={() => handleQuantityChange(-1)} 
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button 
                    className="qty-btn plus" 
                    onClick={() => handleQuantityChange(1)} 
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="actions">
                <button className="cart" onClick={handleAddToCart}>
                  Add to cart
                </button>
                <button className="fav" onClick={handleAddToFavorites}>
                  <img src={favoriteIcon} alt="Add to favorites" />
                  <span>Add to favourites</span>
                </button>
              </div>

              <InfoToggle title="Delivery">
                <p>Standard delivery 2–4 business days.</p>
              </InfoToggle>

              <InfoToggle title="Return">
                <p>30 days free return.</p>
              </InfoToggle>

              <div className="share">
                <span>Share:</span>
                <button 
                  className="social-btn" 
                  onClick={() => handleSocialClick("facebook")}
                >
                  <img src={facebook} alt="Facebook" />
                </button>
                <button 
                  className="social-btn" 
                  onClick={() => handleSocialClick("twitter")}
                >
                  <img src={twitter} alt="Twitter" />
                </button>
                <button 
                  className="social-btn" 
                  onClick={() => handleSocialClick("pinterest")}
                >
                  <img src={pinterest} alt="Pinterest" />
                </button>
              </div>

              <div className="payments">
                <span>Pay with:</span>
                <button 
                  className="payment-btn" 
                  onClick={() => handlePaymentClick("visa")}
                >
                  <img src={visa} alt="Visa" />
                </button>
                <button 
                  className="payment-btn" 
                  onClick={() => handlePaymentClick("mastercard")}
                >
                  <img src={mastercard} alt="Mastercard" />
                </button>
                <button 
                  className="payment-btn" 
                  onClick={() => handlePaymentClick("paypal")}
                >
                  <img src={paypal} alt="PayPal" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT DETAILS */}
        {activeTab === "details" && (
          <KidsProductDetails product={product} />
        )}

        {/* 3. REVIEWS */}
        {activeTab === "reviews" && (
          <KidsReviews product={product} /> 
        )}
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <PaymentModalComponent
          paymentType={selectedPayment}
          product={product}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* SOCIAL SHARE MODAL */}
      {showSocialModal && (
        <SocialShareModalComponent
          socialType={selectedSocial}
          product={product}
          onClose={() => setShowSocialModal(false)}
        />
      )}

      {/* ADDED TO CART NOTIFICATION */}
      {showCartAdded && cartNotificationData && (
        <CartAddedNotification
          isOpen={showCartAdded}
          onClose={() => setShowCartAdded(false)}
          product={cartNotificationData.product}
          size={cartNotificationData.size}
          color={cartNotificationData.color}
          quantity={cartNotificationData.quantity}
          onViewCart={handleViewCart}
        />
      )}

      {/* SIZE WARNING NOTIFICATION */}
      <SizeWarningNotification
        isOpen={showSizeWarning}
        onClose={() => setShowSizeWarning(false)}
        onSizeSelect={handleSizeSelectFromNotification}
      />

      {/* FAVORITE ADDED NOTIFICATION */}
      {showFavoriteAdded && favoriteNotificationData && (
        <FavoriteAddedNotification
          isOpen={showFavoriteAdded}
          onClose={() => setShowFavoriteAdded(false)}
          product={favoriteNotificationData.product}
        />
      )}

      {/* FAVORITE REMOVED NOTIFICATION */}
      {showFavoriteRemoved && favoriteNotificationData && (
        <FavoriteRemovedNotification
          isOpen={showFavoriteRemoved}
          onClose={() => setShowFavoriteRemoved(false)}
          onUndo={handleUndoRemoveFavorite}
          product={favoriteNotificationData.product}
        />
      )}
    </div>
  );
}