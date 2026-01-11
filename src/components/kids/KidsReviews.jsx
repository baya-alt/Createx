import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { 
  FaStar, 
  FaRegStar, 
  FaShoppingCart, 
  FaThumbsUp, 
  FaThumbsDown,
  FaReply,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import LeaveReview from "./KidsLeaveReviews";
// import "./rewiew.css";

/* ================= КОМПОНЕНТЫ УВЕДОМЛЕНИЙ ================= */

// 1. Уведомление "Added to Cart"
function CartAddedNotification({ isOpen, onClose, product, size, color, quantity, onViewCart }) {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isHiding, setIsHiding] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItemsCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        
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

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 300);
    }, [onClose]);

    const handleViewCart = useCallback(() => {
        if (onViewCart) onViewCart();
        handleClose();
    }, [onViewCart, handleClose]);

    const getColorHex = useCallback((colorName) => {
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
    }, []);

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
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop";
                                }}
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

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    }, [onClose]);

    const handleSizeSelect = useCallback((size) => {
        setSelectedSize(size);
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedSize && onSizeSelect) {
            onSizeSelect(selectedSize);
        }
        handleClose();
    }, [selectedSize, onSizeSelect, handleClose]);

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

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    }, [onClose]);

    const handleUndo = useCallback(() => {
        if (onUndo) onUndo();
        handleClose();
    }, [onUndo, handleClose]);

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
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop";
                                    }}
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

    const handleClose = useCallback(() => {
        setIsHiding(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 400);
    }, [onClose]);

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
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop";
                                    }}
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

/* ================= КОМПОНЕНТ ОТЗЫВОВ ================= */

// БОЛЬШЕ ОТЗЫВОВ - ТЕПЕРЬ 12 ШТУК
const allReviewsData = [
  // Страница 1
  {
    id: 1,
    name: "Emma Johnson",
    date: "July 15, 2020",
    rating: 5,
    text: "My 5-year-old loves this jacket! The quality is excellent and it's very comfortable. Perfect for playground adventures.",
    likes: 8,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-07-15").getTime()
  },
  {
    id: 2,
    name: "Sophia Williams",
    date: "1 day ago",
    rating: 0,
    text: "@Emma Johnson My daughter has the same one! It washes really well and keeps its color.",
    likes: 3,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    isReply: true,
    timestamp: new Date().getTime() - 86400000 // 1 день назад
  },
  {
    id: 3,
    name: "Michael Brown",
    date: "July 7, 2020",
    rating: 4,
    text: "Great kids jacket! The material is soft and durable. My son wears it every day to school.",
    likes: 5,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-07-07").getTime()
  },
  {
    id: 4,
    name: "Olivia Davis",
    date: "June 28, 2020",
    rating: 5,
    text: "Perfect fit and amazing quality! The colors are vibrant and it's very easy to clean. Highly recommend for active kids.",
    likes: 12,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-28").getTime()
  },
  // Страница 2
  {
    id: 5,
    name: "James Wilson",
    date: "June 20, 2020",
    rating: 4,
    text: "Good quality hoodie for kids! The material is breathable and perfect for all seasons.",
    likes: 7,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-20").getTime()
  },
  {
    id: 6,
    name: "Ava Miller",
    date: "June 18, 2020",
    rating: 3,
    text: "The jacket is nice but runs a bit small. I would recommend ordering one size up for growing kids.",
    likes: 4,
    dislikes: 2,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-18").getTime()
  },
  {
    id: 7,
    name: "William Taylor",
    date: "June 15, 2020",
    rating: 5,
    text: "Absolutely love it! The green color is beautiful and it's very warm. My daughter won't take it off!",
    likes: 15,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-15").getTime()
  },
  {
    id: 8,
    name: "Isabella Anderson",
    date: "June 10, 2020",
    rating: 5,
    text: "Best kids clothing purchase! The jacket is super comfortable and stylish. Perfect for school and playdates.",
    likes: 9,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-10").getTime()
  },
  // Страница 3
  {
    id: 9,
    name: "Benjamin Thomas",
    date: "June 5, 2020",
    rating: 4,
    text: "Very nice kids jacket. Good value for the price. My son loves the different color options.",
    likes: 6,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-05").getTime()
  },
  {
    id: 10,
    name: "Mia Jackson",
    date: "June 1, 2020",
    rating: 2,
    text: "The material is thinner than expected for winter wear. Good for spring/fall but not for cold weather.",
    likes: 2,
    dislikes: 5,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-06-01").getTime()
  },
  {
    id: 11,
    name: "Daniel White",
    date: "May 25, 2020",
    rating: 5,
    text: "Excellent kids product! Fits perfectly and the quality is outstanding. Would definitely buy again!",
    likes: 11,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-05-25").getTime()
  },
  {
    id: 12,
    name: "Charlotte Harris",
    date: "May 20, 2020",
    rating: 3,
    text: "Decent jacket for the price. Colors are nice but the zipper could be better quality.",
    likes: 3,
    dislikes: 2,
    userLiked: false,
    userDisliked: false,
    timestamp: new Date("2020-05-20").getTime()
  }
];

const REVIEWS_PER_PAGE = 4;

// Варианты сортировки
const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  HIGHEST_RATING: "highest rating",
  LOWEST_RATING: "lowest rating",
  MOST_LIKES: "most likes",
  MOST_DISLIKES: "most dislikes"
};

export default function KidsReviews() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://6947cef21ee66d04a44dfb36.mockapi.io/kids/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const basePrice = Number(data.price?.replace("$", "")) || 0;
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
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!product) return <div className="error-state">Product not found</div>;

  return <KidsReviewsContent product={product} />;
}

function KidsReviewsContent({ product }) {
  // Состояния для уведомлений
  const [showCartAdded, setShowCartAdded] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showFavoriteAdded, setShowFavoriteAdded] = useState(false);
  const [showFavoriteRemoved, setShowFavoriteRemoved] = useState(false);
  
  // Данные для уведомлений
  const [cartNotificationData, setCartNotificationData] = useState(null);
  const [favoriteNotificationData, setFavoriteNotificationData] = useState(null);
  const [lastFavoriteItem, setLastFavoriteItem] = useState(null);
  
  // Состояние для отзывов
  const [reviews, setReviews] = useState(allReviewsData);
  
  // Состояние для сортировки
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  
  // Состояние для модального окна
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Количество товара
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Формируем список доступных цветов для kids
  const colorMap = useMemo(() => {
    const colors = [
      { name: "black", label: "Black", src: product.avatar },
      { name: "white", label: "White", src: product.avatarwhite },
      { name: "blue", label: "Blue", src: product.avatarblue },
      { name: "green", label: "Green", src: product.avatargreen },
    ].filter((c) => c.src && c.src.trim() !== "");
    return colors;
  }, [product]);

  // Массив для слайдера: [Клон последнего, Оригиналы..., Клон первого]
  const slides = useMemo(() => {
    if (!colorMap.length) return [product.avatar || ""];
    const images = colorMap.map((c) => c.src);
    if (images.length === 1) return images;
    return [images[images.length - 1], ...images, images[0]];
  }, [colorMap, product.avatar]);

  const [index, setIndex] = useState(colorMap.length > 1 ? 1 : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSize, setActiveSize] = useState("S");
  const [rating, setRating] = useState(4);

  // Определяем активный цвет для подсветки точек
  const activeColorName = useMemo(() => {
    if (colorMap.length === 0) return "";
    if (colorMap.length === 1) return colorMap[0].name;
    if (index === 0) return colorMap[colorMap.length - 1]?.name;
    if (index === slides.length - 1) return colorMap[0]?.name;
    return colorMap[index - 1]?.name;
  }, [index, colorMap, slides.length]);

  // Получаем активный цвет и изображение
  const activeColor = useMemo(() => {
    if (colorMap.length === 0) return null;
    if (colorMap.length === 1) return colorMap[0];
    if (index === 0) return colorMap[colorMap.length - 1];
    if (index === slides.length - 1) return colorMap[0];
    return colorMap[index - 1];
  }, [index, colorMap, slides.length]);

  // Сортируем отзывы в зависимости от выбранного варианта
  const sortedReviews = useMemo(() => {
    const reviewsCopy = [...reviews];
    
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        return reviewsCopy.sort((a, b) => b.timestamp - a.timestamp);
        
      case SORT_OPTIONS.OLDEST:
        return reviewsCopy.sort((a, b) => a.timestamp - b.timestamp);
        
      case SORT_OPTIONS.HIGHEST_RATING:
        return reviewsCopy.sort((a, b) => b.rating - a.rating);
        
      case SORT_OPTIONS.LOWEST_RATING:
        return reviewsCopy.sort((a, b) => a.rating - b.rating);
        
      case SORT_OPTIONS.MOST_LIKES:
        return reviewsCopy.sort((a, b) => b.likes - a.likes);
        
      case SORT_OPTIONS.MOST_DISLIKES:
        return reviewsCopy.sort((a, b) => b.dislikes - a.dislikes);
        
      default:
        return reviewsCopy;
    }
  }, [reviews, sortBy]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);

  // Получаем отзывы для текущей страницы
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    return sortedReviews.slice(startIndex, endIndex);
  }, [sortedReviews, currentPage]);

  // Функция для обработки лайков
  const handleLike = useCallback((reviewId) => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userLiked) {
            // Убираем лайк
            return {
              ...review,
              likes: review.likes - 1,
              userLiked: false
            };
          } else {
            // Добавляем лайк, убираем дизлайк если был
            const newDislikes = review.userDisliked ? review.dislikes - 1 : review.dislikes;
            return {
              ...review,
              likes: review.likes + 1,
              dislikes: newDislikes,
              userLiked: true,
              userDisliked: false
            };
          }
        }
        return review;
      })
    );
  }, []);

  // Функция для обработки дизлайков
  const handleDislike = useCallback((reviewId) => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userDisliked) {
            // Убираем дизлайк
            return {
              ...review,
              dislikes: review.dislikes - 1,
              userDisliked: false
            };
          } else {
            // Добавляем дизлайк, убираем лайк если был
            const newLikes = review.userLiked ? review.likes - 1 : review.likes;
            return {
              ...review,
              likes: newLikes,
              dislikes: review.dislikes + 1,
              userLiked: false,
              userDisliked: true
            };
          }
        }
        return review;
      })
    );
  }, []);

  // Функции для пагинации
  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Прокрутка вверх при смене страницы
      setTimeout(() => {
        const reviewsElement = document.querySelector('.reviews-list');
        if (reviewsElement) {
          window.scrollTo({
            top: reviewsElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, handlePageChange, totalPages]);

  // Обработчик изменения сортировки
  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене сортировки
  }, []);

  // Функция для открытия модального окна
  const handleOpenReviewModal = useCallback(() => {
    setShowReviewModal(true);
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
  }, []);

  // Функция для закрытия модального окна
  const handleCloseReviewModal = useCallback(() => {
    setShowReviewModal(false);
    // Восстанавливаем скролл страницы
    document.body.style.overflow = 'auto';
  }, []);

  // Функция для добавления нового отзыва
  const handleReviewSubmit = useCallback((newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
    setCurrentPage(1); // Переходим на первую страницу
  }, []);

  // Функция переключения слайдов
  const handleSlideChange = useCallback((newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(newIndex);
  }, [isAnimating]);

  const onTransitionEnd = useCallback(() => {
    setIsAnimating(false);
    
    if (slides.length <= 1) return;
    
    // Если дошли до левого края (клон последнего фото)
    if (index === 0) {
      setIndex(slides.length - 2);
    }
    // Если дошли до правого края (клон первого фото)
    if (index === slides.length - 1) {
      setIndex(1);
    }
  }, [index, slides.length]);

  // Обработчик изменения количества
  const handleQuantityChange = useCallback((change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity >= 1 && newQuantity <= 10) {
        return newQuantity;
      }
      return prev;
    });
  }, []);

  // Обработчик добавления в корзину
  const handleAddToCart = useCallback(() => {
    if (!activeSize) {
      setShowSizeWarning(true);
      return;
    }

    const addedItem = addToCart(product, activeSize, activeColorName, quantity, activeColor?.src);
    
    // Показываем уведомление о добавлении в корзину
    setCartNotificationData({
      product: {
        ...product,
        imageUrl: activeColor?.src
      },
      size: activeSize,
      color: activeColorName,
      quantity: quantity
    });
    setShowCartAdded(true);
  }, [activeSize, activeColorName, quantity, product, activeColor?.src]);

  // Обработчик избранного
  const handleToggleFavorite = useCallback(() => {
    const result = addToFavorites(product, activeColorName, activeColor?.src);
    
    setLastFavoriteItem(result.item);
    setIsFavorite(result.success);
    
    if (result.success) {
      // Показываем уведомление о добавлении в избранное
      setFavoriteNotificationData({
        product: {
          ...product,
          imageUrl: activeColor?.src
        }
      });
      setShowFavoriteAdded(true);
    } else {
      // Показываем уведомление об удалении из избранного
      setFavoriteNotificationData({
        product: {
          ...product,
          imageUrl: activeColor?.src
        }
      });
      setShowFavoriteRemoved(true);
    }
  }, [product, activeColorName, activeColor?.src]);

  // Обработчик выбора размера из уведомления
  const handleSizeSelectFromNotification = useCallback((selectedSize) => {
    setActiveSize(selectedSize);
    
    // Автоматически добавляем в корзину после выбора размера
    setTimeout(() => {
      const addedItem = addToCart(product, selectedSize, activeColorName, quantity, activeColor?.src);
      
      // Показываем уведомление о добавлении в корзину
      setCartNotificationData({
        product: {
          ...product,
          imageUrl: activeColor?.src
        },
        size: selectedSize,
        color: activeColorName,
        quantity: quantity
      });
      setShowCartAdded(true);
    }, 300);
  }, [product, activeColorName, quantity, activeColor?.src]);

  // Обработчик отмены удаления из избранного
  const handleUndoRemoveFavorite = useCallback(() => {
    if (lastFavoriteItem) {
      // Добавляем обратно в избранное
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      favorites.push(lastFavoriteItem);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      setIsFavorite(true);
      
      // Показываем уведомление о добавлении в избранное
      setFavoriteNotificationData({
        product: {
          ...product,
          imageUrl: lastFavoriteItem.imageUrl
        }
      });
      setShowFavoriteAdded(true);
    }
  }, [lastFavoriteItem]);

  // Обработчик открытия корзины
  const handleViewCart = useCallback(() => {
    // Здесь можно добавить логику открытия корзины
    console.log("Opening cart...");
    // Например: window.dispatchEvent(new Event('openCart'));
  }, []);

  // Проверяем, есть ли товар в избранном
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isProductFavorite = favorites.some(fav => 
      fav.productId === product.id && 
      fav.color === activeColorName
    );
    setIsFavorite(isProductFavorite);
  }, [product.id, activeColorName]);

  // Данные статистики для kids
  const statsData = useMemo(() => [
    { stars: 5, count: 8, percentage: 67, color: "#20c997" },
    { stars: 4, count: 2, percentage: 17, color: "#5eead4" },
    { stars: 3, count: 1, percentage: 8, color: "#ffc107" },
    { stars: 2, count: 1, percentage: 8, color: "#fd7e14" },
    { stars: 1, count: 0, percentage: 0, color: "#dc3545" },
  ], []);

  // Подсчёт общего рейтинга и статистики
  const totalRating = useMemo(() => {
    const ratings = reviews.filter(r => r.rating > 0).map(r => r.rating);
    const average = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "0.0";
    
    const recommendedCount = reviews.filter(r => r.rating >= 4).length;
    const recommendationPercentage = reviews.length > 0 
      ? Math.round((recommendedCount / reviews.length) * 100)
      : 0;
    
    return { average, recommendedCount, recommendationPercentage };
  }, [reviews]);

  // Если нет цветов, используем основное изображение
  useEffect(() => {
    if (colorMap.length === 0 && product.avatar) {
      setIndex(0);
    }
  }, [colorMap.length, product.avatar]);

  return (
    <>
      <div className="product-page-wrapper">
        <div className="container">
          <div className="product-layout">
            {/* ЛЕВАЯ КОЛОНКА: ОТЗЫВЫ */}
            <div className="text-info-column">
              {/* Статистика отзывов */}
              <h2 className="reviews-main-title">{reviews.length} reviews</h2>

              <div className="reviews-summary-box">
                <div className="rating-overview">
                  <span className="rating-number">{totalRating.average}</span>
                  <div className="rating-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                  </div>
                  <p className="recommend-text">
                    {totalRating.recommendedCount} out of {reviews.length} ({totalRating.recommendationPercentage}%) <br />
                    <span className="recommend-sub">Parents recommend this product</span>
                  </p>
                </div>

                <div className="rating-bars">
                  {statsData.map((stat) => (
                    <div key={stat.stars} className="rating-bar-row">
                      <span className="bar-star">{stat.stars} ★</span>
                      <div className="bar-background">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color
                          }}
                        />
                      </div>
                      <span className="bar-count">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="reviews-actions-row">
                <button 
                  className="leave-review-btn"
                  onClick={handleOpenReviewModal}
                >
                  Leave a review
                </button>
                <div className="sort-by">
                  <span>Sort by</span>
                  <select 
                    className="sort-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value={SORT_OPTIONS.NEWEST}>newest</option>
                    <option value={SORT_OPTIONS.OLDEST}>oldest</option>
                    <option value={SORT_OPTIONS.HIGHEST_RATING}>highest rating</option>
                    <option value={SORT_OPTIONS.LOWEST_RATING}>lowest rating</option>
                    <option value={SORT_OPTIONS.MOST_LIKES}>most likes</option>
                    <option value={SORT_OPTIONS.MOST_DISLIKES}>most dislikes</option>
                  </select>
                </div>
              </div>

              {/* Список отзывов */}
              <div className="reviews-list">
                {currentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="review-item"
                  >
                    <div className="review-header">
                      <div className="reviewer-info">
                        <h4 className="reviewer-name">{review.name}</h4>
                        <span className="review-date">{review.date}</span>
                      </div>
                      
                      {/* Показываем звезды только если rating > 0 */}
                      {review.rating > 0 && (
                        <div className="review-stars-small">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="star-small">
                              {i < review.rating ? <FaStar /> : <FaRegStar />}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="review-text">{review.text}</p>
                    
                    <div className="review-actions-bottom">
                      <button className="reply-btn-small">
                        <FaReply /> Reply
                      </button>
                      <div className="feedback-btns">
                        <button 
                          className={`like-btn-small ${review.userLiked ? "active" : ""}`}
                          onClick={() => handleLike(review.id)}
                        >
                          <FaThumbsUp /> {review.likes}
                        </button>
                        <button 
                          className={`dislike-btn-small ${review.userDisliked ? "active" : ""}`}
                          onClick={() => handleDislike(review.id)}
                        >
                          <FaThumbsDown /> {review.dislikes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ПАГИНАЦИЯ - ЦИФРЫ 1 2 3 */}
              {totalPages > 1 && (
                <div className="reviews-pagination">
                  <button 
                    className="pagination-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {/* Цифры страниц */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      className={`pagination-btn ${currentPage === pageNumber ? "active" : ""}`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button 
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                  
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </div>

            {/* ПРАВАЯ КОЛОНКА: КАРТОЧКА ТОВАРА СО СЛАЙДЕРОМ */}
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
                    {/* ЛЕВАЯ КНОПКА - показываем только если есть более 1 слайда */}
                    {slides.length > 1 && (
                      <button 
                        className="slider-btn left" 
                        onClick={() => handleSlideChange(index - 1)}
                      >
                        ‹
                      </button>
                    )}

                    <div
                      className="slider-track-details"
                      style={{
                        transform: `translateX(-${index * 100}%)`,
                        transition: isAnimating ? "transform 0.45s ease-out" : "none",
                      }}
                      onTransitionEnd={onTransitionEnd}
                    >
                      {slides.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          className="image-exact slide-img" 
                          alt={`${product.name} view ${i + 1}`}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop";
                          }}
                        />
                      ))}
                    </div>

                    {/* ПРАВАЯ КНОПКА - показываем только если есть более 1 слайда */}
                    {slides.length > 1 && (
                      <button 
                        className="slider-btn right" 
                        onClick={() => handleSlideChange(index + 1)}
                      >
                        ›
                      </button>
                    )}
                  </div>

                  <button 
                    className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? '❤' : '🤍'}
                  </button>
                </div>

                <div className="card-body-exact">
                  <p className="category-text">{product.kategory || "Kids Collection"}</p>
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
                    </div>

                    {colorMap.length > 0 && (
                      <div className="selector-group">
                        <label className="selector-label">Color:</label>
                        <div className="colors-block">
                          {colorMap.map((color, i) => (
                            <span
                              key={color.name}
                              className={`dot d-${color.name} ${
                                activeColorName === color.name ? "active" : ""
                              }`}
                              onClick={() => handleSlideChange(i + 1)}
                            />
                          ))}
                        </div>
                        {activeColor && (
                          <p className="selected-color-text">Selected: {activeColor.label}</p>
                        )}
                      </div>
                    )}

                    <div className="selector-group">
                      <label className="selector-label">Quantity:</label>
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

                    <button className="add-cart-btn" onClick={handleAddToCart}>
                      <FaShoppingCart /> Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ ОТЗЫВОВ */}
      {showReviewModal && (
        <LeaveReview
          onClose={handleCloseReviewModal}
          onReviewSubmit={handleReviewSubmit}
        />
      )}

      {/* УВЕДОМЛЕНИЯ */}
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
    </>
  );
}